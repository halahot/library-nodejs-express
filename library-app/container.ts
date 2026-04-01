import { Container } from "inversify";
import { BooksRepository, MongoBooksRepository } from "./data/BooksRepository.js";

const container = new Container();

container.bind(BooksRepository).to(MongoBooksRepository);

export default container;
