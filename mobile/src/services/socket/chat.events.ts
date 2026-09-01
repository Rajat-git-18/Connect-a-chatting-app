export const SOCKET_EVENTS = {
  MESSAGE_NEW: "message:new",
  CONVERSATION_UPDATED: "conversation:updated",
  CONVERSATION_READ: "conversation:read",
  TYPING_START: "conversation:typing:start",
  TYPING_STOP: "conversation:typing:stop",
  PRESENCE_ONLINE: "presence:online",
  PRESENCE_OFFLINE: "presence:offline",
  PRESENCE_SNAPSHOT: "presence:snapshot",
} as const;

export type ConversationUpdatedPayload = {
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
};

export type ConversationReadPayload = {
  conversationId: string;
  readByUserId: string;
  readAt: string;
};

export type TypingPayload = {
  conversationId: string;
  userId: string;
};

export type PresenceUserPayload = {
  userId: string;
};

export type PresenceSnapshotPayload = {
  userIds: string[];
};
