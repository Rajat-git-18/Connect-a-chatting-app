import api from "./client";
import {
  ConversationResponse,
  ConversationsListResponse,
  CreateConversationPayload,
  MessagesListResponse,
  SendMessagePayload,
  SendMessageResponse,
} from "../../types/chat.types";

export const getConversations = async () => {
  const response = await api.get<ConversationsListResponse>("/conversations");
  return response.data.data;
};

export const createConversation = async (
  payload: CreateConversationPayload
) => {
  const response = await api.post<ConversationResponse>(
    "/conversations",
    payload
  );
  return response.data.data;
};

export const getConversation = async (conversationId: string) => {
  const response = await api.get<ConversationResponse>(
    `/conversations/${conversationId}`
  );
  return response.data.data;
};

export const getMessages = async (
  conversationId: string,
  cursor?: string,
  limit = 30
) => {
  const response = await api.get<MessagesListResponse>(
    `/conversations/${conversationId}/messages`,
    {
      params: {
        ...(cursor ? { cursor } : {}),
        limit,
      },
    }
  );
  return response.data.data;
};

export const sendMessage = async (
  conversationId: string,
  payload: SendMessagePayload
) => {
  const response = await api.post<SendMessageResponse>(
    `/conversations/${conversationId}/messages`,
    payload
  );
  return response.data.data;
};

export const markConversationRead = async (conversationId: string) => {
  const response = await api.patch(`/conversations/${conversationId}/read`);
  return response.data;
};
