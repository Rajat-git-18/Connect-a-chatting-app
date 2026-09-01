import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "@/config/api";
import { getToken } from "@/services/auth/auth.service";

let socket: Socket | null = null;

export async function connectChatSocket(): Promise<Socket | null> {
  const token = await getToken();
  if (!token) return null;

  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function getChatSocket() {
  return socket;
}

export function disconnectChatSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
