import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/User.js";
import { ensureAuth } from "../middleware/auth.js";

const router = express.Router();

// форма логина
router.get("/login", (req, res) => {
  res.render("user/login");
});

// форма регистрации
router.get("/signup", (req, res) => {
  res.render("user/signup");
});

// профиль
router.get("/me", ensureAuth, (req, res) => {
  res.render("user/profile", { user: req.user });
});

// POST логин
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/user/me",
    failureRedirect: "/api/user/login",
  })
);

// POST регистрация
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.redirect("/api/user/signup");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    name,
    passwordHash,
  });

  await user.save();
  res.redirect("/api/user/login");
});

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/api/user/login");
  });
});

export default router;
