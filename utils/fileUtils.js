import fs from "fs";

const dbFile = "../books.json";

export const readBooks = () => {
  try {
    const data = fs.readFileSync(dbFile, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

export const writeBooks = (books) => {
  fs.writeFileSync(dbFile, JSON.stringify(books, null, 2), "utf8");
};
