import { injectable } from "inversify";
import Book, { IBook } from "../models/Book.js";

export abstract class BooksRepository {
  abstract createBook(book: Partial<IBook>): Promise<IBook>;
  abstract getBook(id: string): Promise<IBook | null>;
  abstract getBooks(): Promise<IBook[]>;
  abstract updateBook(id: string, updatedBook: Partial<IBook>): Promise<IBook | null>;
  abstract deleteBook(id: string): Promise<boolean>;
}

@injectable()
export class MongoBooksRepository extends BooksRepository {
  async createBook(book: Partial<IBook>): Promise<IBook> {
    const newBook = new Book(book);
    return newBook.save();
  }

  async getBook(id: string): Promise<IBook | null> {
    return Book.findOne({ id });
  }

  async getBooks(): Promise<IBook[]> {
    return Book.find();
  }

  async updateBook(id: string, updatedBook: Partial<IBook>): Promise<IBook | null> {
    return Book.findOneAndUpdate({ id }, updatedBook, { new: true });
  }

  async deleteBook(id: string): Promise<boolean> {
    const deletedBook = await Book.findOneAndDelete({ id });
    return Boolean(deletedBook);
  }
}
