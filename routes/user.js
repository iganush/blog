import express from "express";
import User from "../models/user.js";
import Blog from "../models/blog.js";

const router = express.Router();

function requireUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/user/signin");
  }
  next();
}

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

    const user = await User.create({ fullName, email, password });
    const token = user.matchPasswordAndGenerateToken(password);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // prod me true
        sameSite: "lax",
      })
      .redirect("/");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Email already exists");
    }
    return res.status(500).send("Something went wrong");
  }
});

//  LOGOUT ROUTE (TOP LEVEL)
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

// Logged in user's profile
router.get("/me", requireUser, (req, res) => {
  return res.redirect(`/user/profile/${req.user._id}`);
});

// Public profile page
router.get("/profile/:id", async (req, res) => {
  const profileUser = await User.findById(req.params.id)
    .select("-password -salt")
    .populate("followers", "fullName profileImageURL")
    .populate("following", "fullName profileImageURL")
    .lean();

  if (!profileUser) {
    return res.status(404).send("User not found");
  }

  const posts = await Blog.find({ createdBy: profileUser._id })
    .sort({ createdAt: -1 })
    .lean();

  let isFollowing = false;
  const isOwnProfile = !!req.user && String(req.user._id) === String(profileUser._id);

  if (req.user && !isOwnProfile) {
    const currentUser = await User.findById(req.user._id).select("following").lean();
    isFollowing =
      currentUser?.following?.some(
        followingUserId => String(followingUserId) === String(profileUser._id)
      ) || false;
  }

  return res.render("profile", {
    user: req.user,
    profileUser,
    posts,
    isFollowing,
    isOwnProfile,
  });
});

// Follow or unfollow a user
router.post("/:id/follow", requireUser, async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  if (String(targetUserId) === String(currentUserId)) {
    return res.redirect(`/user/profile/${targetUserId}`);
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId).select("following"),
    User.findById(targetUserId).select("followers"),
  ]);

  if (!targetUser || !currentUser) {
    return res.status(404).send("User not found");
  }

  const isAlreadyFollowing = currentUser.following.some(
    followingUserId => String(followingUserId) === String(targetUserId)
  );

  if (isAlreadyFollowing) {
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
      User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } }),
    ]);
  } else {
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
      User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } }),
    ]);
  }

  const fallbackPath = `/user/profile/${targetUserId}`;
  const redirectTo =
    typeof req.body.redirectTo === "string" && req.body.redirectTo.startsWith("/")
      ? req.body.redirectTo
      : fallbackPath;

  return res.redirect(redirectTo);
});

export default router;
