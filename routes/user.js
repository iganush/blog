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

// Signin form
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render("signin", { error: "Incorrect Email or password" });
  }

  try {
    const token = user.matchPasswordAndGenerateToken(password);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // prod me true
        sameSite: "lax",
      })
      .redirect("/");
  } catch (err) {
    return res.render("signin", { error: "Incorrect Email or password" });
  }
});

// Signup form
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    await User.create({ fullName, email, password });

    return res.redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Email already exists");
    }
    return res.status(500).send("Something went wrong");
  }
});

// ✅ LOGOUT ROUTE (TOP LEVEL)
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

export default router;
