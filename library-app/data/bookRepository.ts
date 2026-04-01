import Book, { IBook } from "../models/Book.js";

interface BookRepository {
  create(book: Partial<IBook>): Promise<IBook>;
  findAll(): Promise<IBook[]>;
  findById(id: string): Promise<IBook | null>;
  updateById(id: string, data: Partial<IBook>): Promise<IBook | null>;
  deleteById(id: string): Promise<IBook | null>;
}

const bookRepository: BookRepository = {
  async create(book) {
    const newBook = new Book(book);
    return newBook.save();
  },
  async findAll() {
    return Book.find();
  },
  async findById(id) {
    return Book.findOne({ id });
  },
  async updateById(id, data) {
    return Book.findOneAndUpdate({ id }, data, { new: true });
  },
  async deleteById(id) {
    return Book.findOneAndDelete({ id });
  },
};

export default bookRepository;
