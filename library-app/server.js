import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import booksRouter from "./routes/books.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import "./db.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/books");
});

app.use("/books", booksRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
