import express from "express";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/Book.js";
import axios from "axios";
import * as path from "path";
import { upload } from "../middleware/file-upload.js";

const router = express.Router();

// Список книг
router.get("/", async (req, res) => {
  const books = await Book.find();

  res.render("index", { books });
});

// Просмотр одной книги
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const book = await Book.findOne({ id });

  if (!book) {
    return res.status(404).render("view", { book: null });
  }

  await axios.post(`http://counter-service:4000/counter/${id}/incr`);
  const counterResponse = await axios.get(
    `http://counter-service:4000/counter/${id}`
  );

  const counter = counterResponse.data.count;

  res.render("view", { book, counter });
});

// Скачать книгу
router.get("/:id/download", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find((b) => b.id === id);

  if (!book || !book.fileBook) {
    return res.status(404).json({ code: 404, message: "File not found" });
  }

  const filePath = path.resolve(`public/uploads/${book.fileBook}`);
  res.download(filePath, book.fileName || "book");
});

// Форма создания
router.get("/create/new", (req, res) => {
  res.render("create");
});

// Создать книгу
router.post(
  "/create",
  upload.fields([
    { name: "fileCover", maxCount: 1 },
    { name: "fileBook", maxCount: 1 },
  ]),
  async (req, res) => {
    const newBook = new Book({
      id: uuidv4(),
      title: req.body.title || "Без названия",
      description: req.body.description || "",
      authors: req.body.authors || "",
      favorite: req.body.favorite === "on" ? "true" : "",
      fileCover: req.files.fileCover
        ? `uploads/${req.files.fileCover[0].filename}`
        : "",
      fileName: req.files.fileBook ? req.files.fileBook[0].originalname : "",
    });

    await newBook.save();

    res.redirect("/books");
  }
);

// Форма редактирования
router.get("/update/:id", async (req, res) => {
  const book = await Book.findOne({ id: req.params.id });
  if (!book) return res.status(404).render("update", { book: null });
  res.render("update", { book });
});

// Обновление книги
router.post(
  "/update/:id",
  upload.fields([
    { name: "fileBook", maxCount: 1 },
    { name: "fileCover", maxCount: 1 },
  ]),
  async (req, res) => {
    const { id } = req.params;

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      authors: req.body.authors,
      favorite: req.body.favorite === "on" ? "true" : "",
    };

    if (req.files?.fileBook) {
      updateData.fileBook = `uploads/${req.files.fileBook[0].filename}`;
      updateData.fileName = req.files.fileBook[0].originalname;
    }

    if (req.files?.fileCover) {
      updateData.fileCover = `uploads/${req.files.fileCover[0].filename}`;
    }

    await Book.findOneAndUpdate({ id }, updateData);

    res.redirect(`/books/${id}`);
  }
);

// Удалить книгу
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  await Book.findOneAndDelete({ id });

  res.json({ status: "ok" });
});

export default router;
