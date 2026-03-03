import Comment from "../models/Comment.js";

export default function commentsSocket(io, socket) {
  socket.on("joinBook", (bookId) => {
    socket.join(bookId);
  });

  socket.on("newComment", async (data) => {
    const comment = await Comment.create(data);

    io.to(data.bookId).emit("commentAdded", comment);
  });
}
