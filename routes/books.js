import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readBooks, writeBooks } from "../utils/fileUtils.js";
import path from "path";
import { upload } from "../middleware/file-upload.js";

const router = express.Router();

router.get("/", (req, res) => {
  const books = readBooks();
  res.json(books);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ code: 404, message: "Book not found" });
  }

  res.json(book);
});
//download book
router.get("/:id/download", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find((b) => b.id === id);

  if (!book || !book.fileBook) {
    return res.status(404).json({ code: 404, message: "File not found" });
  }

  const filePath = path.resolve(book.fileBook);
  res.download(filePath, book.fileName || "book");
});

// Создать книгу
router.post(
  "/",
  upload.fields([
    { name: "fileBook", maxCount: 1 },
    { name: "fileCover", maxCount: 1 },
  ]),
  (req, res) => {
    const { title, description, authors, favorite } = req.body;
    const books = readBooks();

    const newBook = {
      id: uuidv4(),
      title: title || "",
      description: description || "",
      authors: authors || "",
      favorite: favorite === "true" || favorite === true,
      fileCover: req.files?.fileCover ? req.files.fileCover[0].path : "",
      fileName: req.files?.fileBook ? req.files.fileBook[0].originalname : "",
      fileBook: req.files?.fileBook ? req.files.fileBook[0].path : "",
    };

    books.push(newBook);
    writeBooks(books);

    res.status(201).json(newBook);
  }
);

// Обновить книгу по ID
router.put(
  "/:id",
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

    // Если были загружены новые файлы
    if (req.files?.fileBook) {
      updated.fileBook = req.files.fileBook[0].path;
      updated.fileName = req.files.fileBook[0].originalname;
    }

    if (req.files?.fileCover) {
      updated.fileCover = req.files.fileCover[0].path;
    }

    updated.favorite =
      req.body.favorite === "true" || req.body.favorite === true;

    books[index] = updated;
    writeBooks(books);

    res.json(updated);
  }
);

// Удалить книгу
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ code: 404, message: "Book not found" });
  }

  books.splice(index, 1);
  writeBooks(books);

  res.json({ status: "ok" });
});

export default router;
