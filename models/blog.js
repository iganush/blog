import mongoose from "mongoose";

export const BLOG_CATEGORIES = [
  "Technology",
  "Programming",
  "Web Development",
  "Mobile Apps",
  "Artificial Intelligence",
  "Cyber Security",
  "Career & Interviews",
  "Tutorials",
  "Lifestyle",
  "Travel",
  "Health & Fitness",
  "Finance",
  "Education",
  "Sports",
  "Movies",
  "Short Stories",
  "Poetry",
  "Personal Experiences",
  "Motivation",
  "Book Reviews",
  "History",
  "Science",
  "Entertainment",
  "Others",
  "Business",
  "General",
];

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    coverImageURL: {
      type: String,
    },

    category: {
      type: String,
      enum: BLOG_CATEGORIES,
      default: "Others",
      required: true,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
