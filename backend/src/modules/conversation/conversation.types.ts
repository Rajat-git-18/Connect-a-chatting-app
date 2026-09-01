import type { chatUserSelect } from "./conversation.constants.js";

export interface CreateConversationBody {
  otherUserId: string;
}

export interface SendMessageBody {
  content: string;
}

export interface ConversationParticipant {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
  sender: ConversationParticipant;
}

export interface ConversationListItem {
  id: string;
  otherUser: ConversationParticipant;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    readAt: Date | null;
  } | null;
  unreadCount: number;
  updatedAt: Date;
}

export interface PaginatedMessages {
  messages: MessageItem[];
  nextCursor: string | null;
}

export type ChatUserSelect = typeof chatUserSelect;
