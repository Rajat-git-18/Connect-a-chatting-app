import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyAccessToken } from "../lib/jwt.js";
import { setSocketServer } from "./socket.emitter.js";
import { registerChatSocketHandlers } from "./socket.handlers.js";
import { userRoom } from "./socket.events.js";
import {
  handleUserConnected,
  handleUserDisconnected,
} from "./presence.service.js";

export function initSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string" || !token) {
      next(new Error("Authentication required."));
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.userId;
      next();
    } catch {
      next(new Error("Invalid or expired authentication token."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(userRoom(userId));
    registerChatSocketHandlers(socket);

    void handleUserConnected(userId).catch((error) => {
      console.error("Failed to mark user online:", error);
    });

    socket.on("disconnect", () => {
      socket.leave(userRoom(userId));

      void handleUserDisconnected(userId).catch((error) => {
        console.error("Failed to mark user offline:", error);
      });
    });
  });

  setSocketServer(io);

  return io;
}
