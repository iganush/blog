import express from "express";
import multer from "multer";
import Blog, { BLOG_CATEGORIES } from "../models/blog.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import { removeBlogCoverImage, saveBlogCoverImage } from "../services/blogMedia.js";

const router = express.Router();

function requireUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/user/signin");
  }
  next();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (file.mimetype?.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image uploads are allowed"));
  },
});

// Add blog page
router.get("/add-new", requireUser, (req, res) => {
  return res.render("addBlog", {
    user: req.user,
    categories: BLOG_CATEGORIES,
  });
});

// COMMENT ROUTE (login required)
router.post("/comment/:blogId", requireUser, async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

// DELETE BLOG (only creator can delete)
router.post("/:id/delete", requireUser, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  if (String(blog.createdBy) !== String(req.user._id)) {
    return res.status(403).send("You are not allowed to delete this blog");
  }

  if (blog.coverImageURL || blog.coverImagePublicId) {
    try {
      await removeBlogCoverImage(blog);
    } catch (error) {
      console.error("Failed to remove blog cover image", error);
    }
  }

  await Comment.deleteMany({ blogId: blog._id });
  await Blog.deleteOne({ _id: blog._id });

  return res.redirect("/");
});

// BLOG DETAIL ROUTE
router.get("/:Id", async (req, res) => {
  const blog = await Blog.findById(req.params.Id).populate("createdBy");
  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  const comments = await Comment.find({ blogId: req.params.Id })
    .sort({ createdAt: -1 })
    .populate("createdBy");
  const hasLiked =
    !!req.user &&
    blog?.likedBy?.some(likedUserId => String(likedUserId) === String(req.user._id));
  const isOwnAuthor =
    !!req.user && String(blog.createdBy?._id) === String(req.user._id);

  let isFollowingAuthor = false;
  if (req.user && !isOwnAuthor) {
    const currentUser = await User.findById(req.user._id).select("following").lean();
    isFollowingAuthor =
      currentUser?.following?.some(
        followingUserId => String(followingUserId) === String(blog.createdBy?._id)
      ) || false;
  }

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
    hasLiked,
    isOwnAuthor,
    isFollowingAuthor,
  });
});

// LIKE OR UNLIKE BLOG (login required)
router.post("/:Id/like", requireUser, async (req, res) => {
  const blog = await Blog.findById(req.params.Id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  const hasLiked = blog.likedBy.some(
    likedUserId => String(likedUserId) === String(req.user._id)
  );

  if (hasLiked) {
    blog.likedBy = blog.likedBy.filter(
      likedUserId => String(likedUserId) !== String(req.user._id)
    );
    blog.likesCount = Math.max(0, blog.likesCount - 1);
  } else {
    blog.likedBy.push(req.user._id);
    blog.likesCount += 1;
  }

  await blog.save();

  return res.redirect(`/blog/${req.params.Id}`);
});

// CREATE BLOG
router.post("/", requireUser, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const safeCategory = BLOG_CATEGORIES.includes(category) ? category : "Others";
    const media = await saveBlogCoverImage({
      file: req.file,
      userId: req.user._id,
    });

    await Blog.create({
      title,
      body,
      category: safeCategory,
      coverImageURL: media.coverImageURL,
      coverImagePublicId: media.coverImagePublicId,
      createdBy: req.user._id,
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Failed to publish blog", error);
    return res.status(500).render("addBlog", {
      user: req.user,
      categories: BLOG_CATEGORIES,
      error: "Failed to publish the blog. Please try again.",
    });
  }
});

export default router;
