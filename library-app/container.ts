import { Container } from "inversify";
import { MyBooksRepository } from "./data/BooksRepository.js";

const container = new Container();
container.bind(MyBooksRepository).toSelf();

export { container };
