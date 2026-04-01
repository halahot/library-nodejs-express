import axios from "axios";
import express, { Request, Response } from "express";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import container from "../container.js";
import { BooksRepository } from "../data/BooksRepository.js";
import upload from "../middleware/file-upload.js";
import Comment from "../models/Comment.js";

interface BookRouteParams {
  id: string;
}

interface BookFormBody {
  title?: string;
  description?: string;
  authors?: string;
  favorite?: string;
}

interface UploadedFile {
  filename: string;
  originalname: string;
}

interface UploadedFilesMap {
  fileBook?: UploadedFile[];
  fileCover?: UploadedFile[];
  [key: string]: UploadedFile[] | undefined;
}

interface CounterResponse {
  count: number;
}

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const booksRepository = container.get(BooksRepository);
  const books = await booksRepository.getBooks();

  res.render("index", { books });
});

router.get("/:id", async (req: Request<BookRouteParams>, res: Response) => {
  const { id } = req.params;
  const booksRepository = container.get(BooksRepository);
  const book = await booksRepository.getBook(id);
  const comments = await Comment.find({ bookId: id }).sort({ createdAt: 1 });

  if (!book) {
    res.status(404).render("view", { book: null });
    return;
  }

  await axios.post(`http://counter-service:4000/counter/${id}/incr`);
  const counterResponse = await axios.get<CounterResponse>(
    `http://counter-service:4000/counter/${id}`
  );

  const counter = counterResponse.data.count;

  res.render("view", { book, counter, comments });
});

router.get("/:id/download", async (req: Request<BookRouteParams>, res: Response) => {
  const { id } = req.params;
  const booksRepository = container.get(BooksRepository);
  const book = await booksRepository.getBook(id);

  if (!book || !book.fileBook) {
    res.status(404).json({ code: 404, message: "File not found" });
    return;
  }

  const filePath = path.resolve(`public/${book.fileBook}`);
  res.download(filePath, book.fileName || "book");
});

router.get("/create/new", (_req: Request, res: Response) => {
  res.render("create");
});

router.post(
  "/create",
  upload.fields([
    { name: "fileCover", maxCount: 1 },
    { name: "fileBook", maxCount: 1 },
  ]),
  async (req: Request<Record<string, never>, any, BookFormBody>, res: Response) => {
    const booksRepository = container.get(BooksRepository);
    const files = (req.files || {}) as UploadedFilesMap;

    await booksRepository.createBook({
      id: uuidv4(),
      title: req.body.title || "Без названия",
      description: req.body.description || "",
      authors: req.body.authors || "",
      favorite: req.body.favorite === "on" ? "true" : "",
      fileCover: files.fileCover ? `uploads/${files.fileCover[0].filename}` : "",
      fileBook: files.fileBook ? `uploads/${files.fileBook[0].filename}` : "",
      fileName: files.fileBook ? files.fileBook[0].originalname : "",
    });

    res.redirect("/books");
  }
);

router.get("/update/:id", async (req: Request<BookRouteParams>, res: Response) => {
  const booksRepository = container.get(BooksRepository);
  const book = await booksRepository.getBook(req.params.id);
  if (!book) {
    res.status(404).render("update", { book: null });
    return;
  }

  res.render("update", { book });
});

router.post(
  "/update/:id",
  upload.fields([
    { name: "fileBook", maxCount: 1 },
    { name: "fileCover", maxCount: 1 },
  ]),
  async (req: Request<any, any, BookFormBody>, res: Response) => {
    const { id } = req.params as BookRouteParams;
    const booksRepository = container.get(BooksRepository);
    const files = (req.files || {}) as UploadedFilesMap;

    const updateData: any = {
      title: req.body.title,
      description: req.body.description,
      authors: req.body.authors,
      favorite: req.body.favorite === "on" ? "true" : "",
    };

    if (files.fileBook) {
      updateData.fileBook = `uploads/${files.fileBook[0].filename}`;
      updateData.fileName = files.fileBook[0].originalname;
    }

    if (files.fileCover) {
      updateData.fileCover = `uploads/${files.fileCover[0].filename}`;
    }

    await booksRepository.updateBook(id, updateData);

    res.redirect(`/books/${id}`);
  }
);

router.delete("/delete/:id", async (req: Request<BookRouteParams>, res: Response) => {
  const { id } = req.params;
  const booksRepository = container.get(BooksRepository);

  await booksRepository.deleteBook(id);

  res.json({ status: "ok" });
});

export default router;
