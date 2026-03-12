import express from "express";
import { v4 as uuidv4 } from "uuid";
import Book from "../models/Book.js";
import Comment from "../models/Comment.js";
import axios from "axios";
import * as path from "path";
import { upload } from "../middleware/file-upload.js";
import { container } from "../container.js";
import { MyBooksRepository } from "../data/BooksRepository.js";

const router = express.Router();

// Список книг
router.get("/", async (req, res) => {
  const repo = container.get(MyBooksRepository);
  const books = await repo.getBooks();

  res.render("index", { books });
});

// Просмотр одной книги
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const repo = container.get(MyBooksRepository);
  const book = await repo.getBook(id);
  const comments = await Comment.find({ bookId: id }).sort({ createdAt: 1 });

  if (!book) {
    return res.status(404).render("view", { book: null });
  }

  try {
    await axios.post(`http://counter-service:4000/counter/${id}/incr`);
    const counterResponse = await axios.get(
      `http://counter-service:4000/counter/${id}`
    );
    const counter = counterResponse.data.count;
    res.render("view", { book, counter, comments });
  } catch (e) {
    res.render("view", { book, counter: 0, comments });
  }
});

// Скачать книгу
router.get("/:id/download", async (req, res) => {
  const { id } = req.params;
  const repo = container.get(MyBooksRepository);
  const book = await repo.getBook(id);

  if (!book || !book.fileBook) {
    return res.status(404).json({ code: 404, message: "File not found" });
  }

  const filePath = path.resolve(`public/${book.fileBook}`);
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
    const repo = container.get(MyBooksRepository);
    await repo.createBook({
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

    res.redirect("/books");
  }
);

// Форма редактирования
router.get("/update/:id", async (req, res) => {
  const repo = container.get(MyBooksRepository);
  const book = await repo.getBook(req.params.id);
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
    const repo = container.get(MyBooksRepository);

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

    await repo.updateBook(id, updateData);

    res.redirect(`/books/${id}`);
  }
);

// Удалить книгу
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const repo = container.get(MyBooksRepository);

  await repo.deleteBook(id);

  res.json({ status: "ok" });
});

export default router;
