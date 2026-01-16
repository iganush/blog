import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Blog from '../models/blog.js'
const router = express.Router();



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(`./public/uploads/${req.user._id}`);

    
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    const fileName = uniqueName + ext;

    cb(null, fileName);
  },
});

const upload = multer({ storage });



// Add blog page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});


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
