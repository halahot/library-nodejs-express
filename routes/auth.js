import express from "express";

const router = express.Router();

// Авторизация пользователя
router.post("/api/user/login", (req, res) => {
  res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

export default router;
