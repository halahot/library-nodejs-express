import express from "express";
import authRouter from "./routes/auth.js";
import booksRouter from "./routes/books.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/uploads", express.static("uploads"));
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
