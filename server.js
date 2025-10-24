import express from "express";
import { v4 as uuidv4 } from "uuid";
import { readBooks, writeBooks } from "./utils/fileUtils.js";

const app = express();
const port = 3000;

app.use(express.json());

// Авторизация пользователя
app.post("/api/user/login", (_req, res) => {
  res.status(201).json({ id: 1, mail: "test@mail.ru" });
});

// Получить все книги
app.get("/api/books", (_req, res) => {
  const books = readBooks();
  res.json(books);
});

// Получить книгу по ID
app.get("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ code: 404, message: "Book not found" });
  }

  res.json(book);
});

// Создать книгу
app.post("/api/books", (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const books = readBooks();

  const newBook = {
    id: uuidv4(),
    title: title || "",
    description: description || "",
    authors: authors || "",
    favorite: favorite || "",
    fileCover: fileCover || "",
    fileName: fileName || "",
  };

  books.push(newBook);
  writeBooks(books);

  res.status(201).json(newBook);
});

// Редактировать книгу по ID
app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ code: 404, message: "Book not found" });
  }

  books[index] = { ...books[index], ...req.body };
  writeBooks(books);

  res.json(books[index]);
});

// Удалить книгу по ID
app.delete("/api/books/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
