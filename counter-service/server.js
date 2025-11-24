import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;

const dbPath = path.resolve("./counter.json");

const readCounters = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch {
    return {};
  }
};

const writeCounters = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
};

app.post("/counter/:bookId/incr", (req, res) => {
  const counters = readCounters();
  const id = req.params.bookId;

  counters[id] = (counters[id] || 0) + 1;
  writeCounters(counters);

  res.json({ bookId: id, count: counters[id] });
});

// Получить значение
app.get("/counter/:bookId", (req, res) => {
  const counters = readCounters();
  const id = req.params.bookId;

  res.json({ bookId: id, count: counters[id] || 0 });
});

app.listen(PORT, () => {
  console.log(`Counter service running on port ${PORT}`);
});
