import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, "books.json");

export const readBooks = () => {
  try {
    const data = fs.readFileSync(dbFile, "utf8");
    const books = JSON.parse(data || "[]");
    console.log(`Loaded ${books.length} books from ${dbFile}`);
    return books;
  } catch (err) {
    console.error("Error reading books:", err.message);
    return [];
  }
};

export const writeBooks = (books) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(books, null, 2), "utf8");
    console.log(`Saved ${books.length} books to ${dbFile}`);
  } catch (err) {
    console.error("Error writing books:", err.message);
  }
};
