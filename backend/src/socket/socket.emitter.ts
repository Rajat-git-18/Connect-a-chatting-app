import type { Server } from "socket.io";
import type { MessageItem } from "../modules/conversation/conversation.types.js";
import { SOCKET_EVENTS, userRoom } from "./socket.events.js";

let io: Server | null = null;

export function setSocketServer(server: Server) {
  io = server;
}

export function getSocketServer(): Server {
  if (!io) {
    throw new Error("Socket.IO server is not initialized.");
  }

  return io;
}

function serializeMessage(message: MessageItem) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt?.toISOString() ?? null,
    sender: message.sender,
  };
}

export function emitMessageNew(userId: string, message: MessageItem) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.MESSAGE_NEW, serializeMessage(message));
}

export function emitConversationUpdated(
  userId: string,
  payload: {
    conversationId: string;
    lastMessage: {
      id: string;
      content: string;
      senderId: string;
      createdAt: string;
      readAt: string | null;
    };
    updatedAt: string;
    senderId: string;
  }
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.CONVERSATION_UPDATED, payload);
}

export function emitConversationRead(
  userId: string,
  payload: {
    conversationId: string;
    readByUserId: string;
    readAt: string;
  }
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.CONVERSATION_READ, payload);
}

export function emitPresenceOnline(userId: string, payload: { userId: string }) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.PRESENCE_ONLINE, payload);
}

export function emitPresenceOffline(userId: string, payload: { userId: string }) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.PRESENCE_OFFLINE, payload);
}

export function emitPresenceSnapshot(
  userId: string,
  payload: { userIds: string[] }
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.PRESENCE_SNAPSHOT, payload);
}

function serializeConnectionRequest(request: {
  id: string;
  status: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    displayName: string;
    profileImage: string | null;
    bio: string | null;
  };
  receiver: {
    id: string;
    username: string;
    displayName: string;
    profileImage: string | null;
    bio: string | null;
  };
  question: {
    id: string;
    question: string;
  };
}) {
  return {
    id: request.id,
    status: request.status,
    answer: request.answer,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    sender: request.sender,
    receiver: request.receiver,
    question: request.question,
  };
}

export function emitConnectionRequestNew(
  userId: string,
  request: Parameters<typeof serializeConnectionRequest>[0]
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.CONNECTION_REQUEST_NEW, serializeConnectionRequest(request));
}

export function emitConnectionRequestRemoved(
  userId: string,
  payload: { requestId: string }
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.CONNECTION_REQUEST_REMOVED, payload);
}

export function emitConnectionNew(
  userId: string,
  payload: {
    id: string;
    connectedAt: string;
    user: {
      id: string;
      username: string;
      displayName: string;
      profileImage: string | null;
      bio: string | null;
    };
  }
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.CONNECTION_NEW, payload);
}

export function emitConnectionRemoved(
  userId: string,
  payload: { connectionId: string; otherUserId: string }
) {
  getSocketServer()
    .to(userRoom(userId))
    .emit(SOCKET_EVENTS.CONNECTION_REMOVED, payload);
}
