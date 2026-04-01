import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import passport from "passport";
import ensureAuth from "../middleware/auth.js";
import User from "../models/User.js";

interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
}

const router = express.Router();

router.get("/login", (_req: Request, res: Response) => {
  res.render("user/login");
});

router.get("/signup", (_req: Request, res: Response) => {
  res.render("user/signup");
});

router.get("/me", ensureAuth, (req: Request, res: Response) => {
  res.render("user/profile", { user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/user/me",
    failureRedirect: "/api/user/login",
  })
);

router.post(
  "/signup",
  async (req: Request<Record<string, never>, any, SignupRequestBody>, res: Response) => {
    const { email, password, name } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.redirect("/api/user/signup");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      passwordHash,
    });

    await user.save();
    res.redirect("/api/user/login");
  }
);

router.get("/logout", (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/api/user/login");
  });
});

export default router;
