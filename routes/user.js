import express from "express";
import User from "../models/user.js";

const router = express.Router();

// Signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

// Signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});


// 
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }

  const isMatch = user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }

  return res.send("Login successful");
});

// 
// Signup form submit
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    await User.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);

    // Duplicate email error
    if (error.code === 11000) {
      return res.status(400).send("Email already exists");
    }

    return res.status(500).send("Something went wrong");
  }
});



export default router;
