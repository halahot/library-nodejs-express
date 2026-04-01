import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/user/login", (_req: Request, res: Response) => {
  res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

export default router;
