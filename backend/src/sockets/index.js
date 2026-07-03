import { Server } from "socket.io";

import { appConfig } from "../config/app.config.js";
import { registerChatSocketHandlers } from "./chat.socket.js";
import { socketAuthMiddleware } from "./socketAuth.middleware.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: appConfig.frontendUrls,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerChatSocketHandlers(io, socket);
  });

  return io;
};
