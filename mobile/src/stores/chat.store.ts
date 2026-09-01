import { create } from "zustand";

type ChatUiStore = {
  activeConversationId: string | null;
  setActiveConversationId: (conversationId: string | null) => void;
  typingByConversation: Record<string, boolean>;
  setTypingForConversation: (
    conversationId: string,
    isTyping: boolean
  ) => void;
  onlineUserIds: Record<string, boolean>;
  setUserOnline: (userId: string, isOnline: boolean) => void;
  setOnlineSnapshot: (userIds: string[]) => void;
};

export const useChatUiStore = create<ChatUiStore>((set) => ({
  activeConversationId: null,
  setActiveConversationId: (conversationId) =>
    set({ activeConversationId: conversationId }),
  typingByConversation: {},
  setTypingForConversation: (conversationId, isTyping) =>
    set((state) => ({
      typingByConversation: {
        ...state.typingByConversation,
        [conversationId]: isTyping,
      },
    })),
  onlineUserIds: {},
  setUserOnline: (userId, isOnline) =>
    set((state) => ({
      onlineUserIds: {
        ...state.onlineUserIds,
        [userId]: isOnline,
      },
    })),
  setOnlineSnapshot: (userIds) =>
    set((state) => {
      const nextOnlineUserIds = { ...state.onlineUserIds };

      for (const userId of userIds) {
        nextOnlineUserIds[userId] = true;
      }

      return { onlineUserIds: nextOnlineUserIds };
    }),
}));

export function useIsOtherUserTyping(conversationId: string) {
  return useChatUiStore(
    (state) => state.typingByConversation[conversationId] ?? false
  );
}

export function useIsUserOnline(userId?: string) {
  return useChatUiStore((state) =>
    userId ? state.onlineUserIds[userId] === true : false
  );
}
