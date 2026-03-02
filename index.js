import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middlewares/authentication.js";
import Blog, { BLOG_CATEGORIES } from "./models/blog.js";
import User from "./models/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB = process.env.MONGODB_URL;

// db
mongoose
  .connect(MONGODB)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// routes
app.get("/", async (req, res) => {
  try {
    const categories = ["All", ...BLOG_CATEGORIES];
    const selectedCategory = categories.includes(req.query.category)
      ? req.query.category
      : "All";
    const searchQuery = (req.query.q || "").trim();
    const searchType = ["all", "users", "blogs"].includes(req.query.type)
      ? req.query.type
      : "all";

    const categoryFilter = selectedCategory === "All" ? {} : { category: selectedCategory };
    const regex = searchQuery ? new RegExp(searchQuery, "i") : null;

    const blogFilter = { ...categoryFilter };
    if (regex && (searchType === "all" || searchType === "blogs")) {
      blogFilter.$or = [
        { title: regex },
        { body: regex },
        { category: regex },
      ];
    }

    const [blogs, trendingBlogs, suggestedUsers, userResults, currentUser] = await Promise.all([
      Blog.find(blogFilter)
        .populate("createdBy", "fullName profileImageURL")
        .sort({ createdAt: -1 })
        .lean(),
      Blog.find({})
        .populate("createdBy", "fullName profileImageURL")
        .sort({ likesCount: -1, createdAt: -1 })
        .limit(5)
        .lean(),
      User.find(req.user ? { _id: { $ne: req.user._id } } : {})
        .select("fullName profileImageURL followers")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      regex && (searchType === "all" || searchType === "users")
        ? User.find({
            ...(req.user ? { _id: { $ne: req.user._id } } : {}),
            $or: [{ fullName: regex }, { email: regex }],
          })
            .select("fullName email profileImageURL followers following")
            .limit(8)
            .lean()
        : Promise.resolve([]),
      req.user
        ? User.findById(req.user._id).select("following").lean()
        : Promise.resolve(null),
    ]);

    const currentUserFollowingIds = (currentUser?.following || []).map(id => String(id));
    const latestBlog = blogs[0] || null;

    res.render("home", {
      user: req.user,
      blogs,
      latestBlog,
      trendingBlogs,
      selectedCategory,
      categories,
      searchQuery,
      searchType,
      userResults,
      suggestedUsers,
      currentUserFollowingIds,
      currentPath: req.originalUrl || "/",
    });
  } catch (error) {
    res.render("home", {
      user: req.user,
      blogs: [],
      latestBlog: null,
      trendingBlogs: [],
      selectedCategory: "All",
      categories: ["All", ...BLOG_CATEGORIES],
      searchQuery: "",
      searchType: "all",
      userResults: [],
      suggestedUsers: [],
      currentUserFollowingIds: [],
      currentPath: "/",
      error: "Failed to load blogs",
    });
  }
});

app.use("/user", UserRouter);
app.use("/blog", blogRouter);

// server
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
