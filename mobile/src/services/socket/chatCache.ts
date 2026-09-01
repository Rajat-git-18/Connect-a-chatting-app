import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
  ChatLastMessage,
  ChatMessage,
  ConversationListItem,
  PaginatedMessages,
} from "@/types/chat.types";
import type {
  ConversationReadPayload,
  ConversationUpdatedPayload,
} from "@/services/socket/chat.events";

export const MESSAGES_QUERY_KEY = (conversationId: string) =>
  ["messages", conversationId] as const;

export const CONVERSATIONS_QUERY_KEY = ["conversations"] as const;

function messageExists(
  data: InfiniteData<PaginatedMessages> | undefined,
  messageId: string
) {
  return data?.pages.some((page) =>
    page.messages.some((message) => message.id === messageId)
  );
}

export function prependMessageToCache(
  data: InfiniteData<PaginatedMessages> | undefined,
  message: ChatMessage
): InfiniteData<PaginatedMessages> {
  if (!data?.pages.length) {
    return {
      pages: [{ messages: [message], nextCursor: null }],
      pageParams: [undefined],
    };
  }

  if (messageExists(data, message.id)) {
    return data;
  }

  const [firstPage, ...restPages] = data.pages;

  return {
    ...data,
    pages: [
      {
        ...firstPage,
        messages: [message, ...firstPage.messages],
      },
      ...restPages,
    ],
  };
}

export function replaceOptimisticMessageInCache(
  data: InfiniteData<PaginatedMessages> | undefined,
  optimisticId: string | null | undefined,
  serverMessage: ChatMessage
): InfiniteData<PaginatedMessages> | undefined {
  if (!data?.pages.length) {
    return prependMessageToCache(undefined, serverMessage);
  }

  let replaced = false;

  const pages = data.pages.map((page) => ({
    ...page,
    messages: page.messages.flatMap((message) => {
      if (optimisticId && message.id === optimisticId) {
        replaced = true;
        return messageExists(data, serverMessage.id) ? [] : [serverMessage];
      }

      if (message.id === serverMessage.id) {
        return [serverMessage];
      }

      return [message];
    }),
  }));

  if (!replaced && !messageExists(data, serverMessage.id)) {
    pages[0] = {
      ...pages[0],
      messages: [serverMessage, ...pages[0].messages],
    };
  }

  return { ...data, pages };
}

export function upsertMessageInCache(
  queryClient: QueryClient,
  conversationId: string,
  message: ChatMessage,
  replaceOptimisticId?: string | null
) {
  queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
    MESSAGES_QUERY_KEY(conversationId),
    (current) => {
      if (replaceOptimisticId) {
        return replaceOptimisticMessageInCache(
          current,
          replaceOptimisticId,
          message
        );
      }

      return prependMessageToCache(current, message);
    }
  );
}

export function markMessageFailedInCache(
  queryClient: QueryClient,
  conversationId: string,
  optimisticId: string
) {
  queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
    MESSAGES_QUERY_KEY(conversationId),
    (current) => {
      if (!current?.pages.length) return current;

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message) =>
            message.id === optimisticId
              ? { ...message, status: "failed" as const }
              : message
          ),
        })),
      };
    }
  );
}

export function patchConversationList(
  queryClient: QueryClient,
  payload: ConversationUpdatedPayload,
  currentUserId: string | undefined,
  activeConversationId: string | null | undefined
) {
  queryClient.setQueryData<ConversationListItem[]>(
    CONVERSATIONS_QUERY_KEY,
    (current) => {
      if (!current) return current;

      const index = current.findIndex(
        (conversation) => conversation.id === payload.conversationId
      );

      if (index === -1) {
        void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
        return current;
      }

      const existing = current[index];
      const isOwnMessage = payload.senderId === currentUserId;
      const isActiveConversation =
        activeConversationId === payload.conversationId;

      const unreadCount =
        isOwnMessage || isActiveConversation
          ? isActiveConversation
            ? 0
            : existing.unreadCount
          : existing.unreadCount + 1;

      const updated: ConversationListItem = {
        ...existing,
        lastMessage: payload.lastMessage as ChatLastMessage,
        updatedAt: payload.updatedAt,
        unreadCount,
      };

      return [
        updated,
        ...current.filter((_, itemIndex) => itemIndex !== index),
      ];
    }
  );
}

export function patchConversationReadInCache(
  queryClient: QueryClient,
  payload: ConversationReadPayload
) {
  queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
    MESSAGES_QUERY_KEY(payload.conversationId),
    (current) => {
      if (!current?.pages.length) return current;

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          messages: page.messages.map((message) =>
            message.senderId !== payload.readByUserId
              ? { ...message, readAt: payload.readAt }
              : message
          ),
        })),
      };
    }
  );

  queryClient.setQueryData<ConversationListItem[]>(
    CONVERSATIONS_QUERY_KEY,
    (current) => {
      if (!current) return current;

      return current.map((conversation) => {
        if (conversation.id !== payload.conversationId) {
          return conversation;
        }

        const lastMessage = conversation.lastMessage
          ? {
              ...conversation.lastMessage,
              readAt:
                conversation.lastMessage.senderId !== payload.readByUserId
                  ? payload.readAt
                  : conversation.lastMessage.readAt,
            }
          : null;

        return {
          ...conversation,
          unreadCount: 0,
          lastMessage,
        };
      });
    }
  );
}

export function bumpConversationAfterSend(
  queryClient: QueryClient,
  conversationId: string,
  lastMessage: ChatLastMessage,
  updatedAt: string
) {
  queryClient.setQueryData<ConversationListItem[]>(
    CONVERSATIONS_QUERY_KEY,
    (current) => {
      if (!current) return current;

      const index = current.findIndex(
        (conversation) => conversation.id === conversationId
      );

      if (index === -1) return current;

      const existing = current[index];
      const updated: ConversationListItem = {
        ...existing,
        lastMessage,
        updatedAt,
      };

      return [
        updated,
        ...current.filter((_, itemIndex) => itemIndex !== index),
      ];
    }
  );
}
