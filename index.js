import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middlewares/authentication.js";
import Blog from "./models/blog.js";

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
    const allBlogs = await Blog.find({}).lean();

    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    res.render("home", {
      user: req.user,
      blogs: [],
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
