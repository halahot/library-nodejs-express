import "reflect-metadata";
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import * as path from "path";
import { fileURLToPath } from "url";
import booksRouter from "./routes/books.js";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import session from "express-session";
import passport from "passport";
import passportConfig from "./config/passport.js";
import userRoutes from "./routes/user.js";
import initSocket from "./realtime/index.js";
import "./db.js";

const app = express();
const port = Number(process.env.HTTP_PORT || 3001);
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);
const io = new Server(server);

initSocket(io);

app.set("view engine", "ejs");

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

passportConfig(passport);

app.get("/", (req: Request, res: Response) => {
  res.redirect("/books");
});

app.use("/books", booksRouter);
app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
