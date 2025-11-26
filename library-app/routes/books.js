import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readBooks, writeBooks } from "../data/bookRepository.js";
import * as path from "path";
import axios from "axios";
import { upload } from "../middleware/file-upload.js";

const router = express.Router();

// Список книг
router.get("/", (req, res) => {
  const books = readBooks();
  res.render("index", { books });
});

// Просмотр одной книги
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find((b) => b.id === id);

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
  (req, res) => {
    const books = readBooks();

    const newBook = {
      id: uuidv4(),
      title: req.body.title || "Без названия",
      description: req.body.description || "",
      authors: req.body.authors || "",
      favorite: req.body.favorite === "on",
      fileCover: req.files.fileCover
        ? `uploads/${req.files.fileCover[0].filename}`
        : "",
      fileName: req.files.fileBook ? req.files.fileBook[0].originalname : "",
      fileBook: req.files.fileBook
        ? `uploads/${req.files.fileBook[0].filename}`
        : "",
    };

    books.push(newBook);
    writeBooks(books);

    res.redirect("/books");
  }
);

// Форма редактирования
router.get("/update/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id === req.params.id);
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
  (req, res) => {
    const { id } = req.params;
    const books = readBooks();
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ code: 404, message: "Book not found" });
    }

    const updated = {
      ...books[index],
      ...req.body,
    };

    if (req.files?.fileBook) {
      updated.fileBook = `uploads/${req.files.fileBook[0].filename}`;
      updated.fileName = req.files.fileBook[0].originalname;
    }

    if (req.files?.fileCover) {
      updated.fileCover = `uploads/${req.files.fileCover[0].filename}`;
    }

    updated.favorite = req.body.favorite === "on";

    books[index] = updated;
    writeBooks(books);

    res.redirect(`/books/${id}`);
  }
);

// Удалить книгу
router.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const filtered = books.filter((b) => b.id !== id);

  if (filtered.length === books.length) {
    return res.status(404).json({ code: 404, message: "Book not found" });
  }

  writeBooks(filtered);
  res.redirect("/books");
});

export default router;
