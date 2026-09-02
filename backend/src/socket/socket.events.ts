export const SOCKET_EVENTS = {
  MESSAGE_NEW: "message:new",
  CONVERSATION_UPDATED: "conversation:updated",
  CONVERSATION_READ: "conversation:read",
  TYPING_START: "conversation:typing:start",
  TYPING_STOP: "conversation:typing:stop",
  PRESENCE_ONLINE: "presence:online",
  PRESENCE_OFFLINE: "presence:offline",
  PRESENCE_SNAPSHOT: "presence:snapshot",
  CONNECTION_REQUEST_NEW: "connection:request:new",
  CONNECTION_REQUEST_REMOVED: "connection:request:removed",
  CONNECTION_NEW: "connection:new",
  CONNECTION_REMOVED: "connection:removed",
} as const;

export function userRoom(userId: string) {
  return `user:${userId}`;
}
