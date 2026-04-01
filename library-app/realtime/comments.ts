import { Server, Socket } from "socket.io";
import Comment from "../models/Comment.js";

interface JoinBookHandler {
  (bookId: string): void;
}

interface NewCommentPayload {
  bookId: string;
  user: string;
  text: string;
}

interface CommentSocketEvents {
  joinBook: JoinBookHandler;
  newComment: (data: NewCommentPayload) => Promise<void>;
}

const commentsSocket = (
  io: Server,
  socket: Socket<any, any, any, any>
): void => {
  socket.on("joinBook", ((bookId: string) => {
    socket.join(bookId);
  }) as CommentSocketEvents["joinBook"]);

  socket.on("newComment", (async (data: NewCommentPayload) => {
    const comment = await Comment.create(data);

    io.to(data.bookId).emit("commentAdded", comment);
  }) as CommentSocketEvents["newComment"]);
};

export default commentsSocket;
