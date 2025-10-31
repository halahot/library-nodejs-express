import express from "express";
import authRouter from "./routes/auth.js";
import booksRouter from "./routes/books.js";

const app = express();
const port = 3000;

app.use(express.json());

// Подключаем router для книг
app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
