import { NextFunction, Request, Response } from "express";

const ensureAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect("/api/user/login");
};

export default ensureAuth;
