import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(`./public/uploads/${req.user._id}`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage });



// Add blog page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// COMMENT ROUTE (login required)
router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

// DELETE BLOG (only creator can delete)
router.post("/:id/delete", async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  if (String(blog.createdBy) !== String(req.user._id)) {
    return res.status(403).send("You are not allowed to delete this blog");
  }

  if (blog.coverImageURL) {
    const imagePath = path.resolve(`./public${blog.coverImageURL}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Comment.deleteMany({ blogId: blog._id });
  await Blog.deleteOne({ _id: blog._id });

  return res.redirect("/");
});

// BLOG DETAIL ROUTE
router.get("/:Id", async (req, res) => {
  const blog = await Blog.findById(req.params.Id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.Id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

// CREATE BLOG
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const coverImageURL = req.file
    ? `/uploads/${req.user._id}/${req.file.filename}`
    : null;

  await Blog.create({
    title,
    body,
    coverImageURL,
    createdBy: req.user._id,
  });

  return res.redirect("/");
});

export default router;
