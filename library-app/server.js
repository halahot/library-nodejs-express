import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import booksRouter from "./routes/books.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import session from "express-session";
import passport from "passport";
import passportConfig from "./config/passport.js";
import userRoutes from "./routes/user.js";
import "./db.js";

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");

app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

passportConfig(passport);

app.get("/", (req, res) => {
  res.redirect("/books");
});

app.use("/books", booksRouter);
app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
