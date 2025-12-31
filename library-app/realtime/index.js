// socket/index.js
import commentsSocket from "./comments.js";

export default function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    commentsSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
