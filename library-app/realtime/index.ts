import { Server, Socket } from "socket.io";
import commentsSocket from "./comments.js";

const initSocket = (io: Server): void => {
  io.on("connection", (socket: Socket<any, any, any, any>) => {
    console.log("Socket connected:", socket.id);

    commentsSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default initSocket;
