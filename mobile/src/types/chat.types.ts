export interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
}

export interface ChatLastMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
}

export interface ConversationListItem {
  id: string;
  otherUser: ChatUser;
  lastMessage: ChatLastMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: ChatUser;
  status?: "pending" | "sent" | "failed";
}

export interface PaginatedMessages {
  messages: ChatMessage[];
  nextCursor: string | null;
}

export interface ConversationResponse {
  success: boolean;
  message: string;
  data: ConversationListItem;
}

export interface ConversationsListResponse {
  success: boolean;
  message: string;
  data: ConversationListItem[];
}

export interface MessagesListResponse {
  success: boolean;
  message: string;
  data: PaginatedMessages;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
}

export interface CreateConversationPayload {
  otherUserId: string;
}

export interface SendMessagePayload {
  content: string;
}
