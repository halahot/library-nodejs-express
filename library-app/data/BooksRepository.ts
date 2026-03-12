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
export class MyBooksRepository extends BooksRepository {
  async createBook(book: Partial<IBook>): Promise<IBook> {
    const newBook = new Book(book);
    return await newBook.save();
  }

  async getBook(id: string): Promise<IBook | null> {
    return await Book.findOne({ id });
  }

  async getBooks(): Promise<IBook[]> {
    return await Book.find();
  }

  async updateBook(id: string, updatedBook: Partial<IBook>): Promise<IBook | null> {
    return await Book.findOneAndUpdate({ id }, updatedBook, { new: true });
  }

  async deleteBook(id: string): Promise<boolean> {
    const result = await Book.findOneAndDelete({ id });
    return !!result;
  }
}
