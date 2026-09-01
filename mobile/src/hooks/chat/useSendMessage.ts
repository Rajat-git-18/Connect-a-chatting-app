import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { sendMessage } from "@/services/api/conversation.api";
import { PROFILE_ME_QUERY_KEY } from "@/hooks/profile/useProfile";
import {
  bumpConversationAfterSend,
  markMessageFailedInCache,
  MESSAGES_QUERY_KEY,
  prependMessageToCache,
  replaceOptimisticMessageInCache,
} from "@/services/socket/chatCache";
import type { SendMessagePayload, ChatMessage, PaginatedMessages } from "@/types/chat.types";
import type { UserProfile } from "@/types/profile.types";

function createOptimisticId() {
  return `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      sendMessage(conversationId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: MESSAGES_QUERY_KEY(conversationId),
      });

      const previousMessages = queryClient.getQueryData<
        InfiniteData<PaginatedMessages>
      >(MESSAGES_QUERY_KEY(conversationId));

      const profile = queryClient.getQueryData<UserProfile>(PROFILE_ME_QUERY_KEY);
      const content = payload.content.trim();

      if (!profile || !content) {
        return { previousMessages, optimisticId: null };
      }

      const optimisticId = createOptimisticId();
      const optimisticMessage: ChatMessage = {
        id: optimisticId,
        conversationId,
        senderId: profile.id,
        content,
        createdAt: new Date().toISOString(),
        readAt: null,
        sender: {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profileImage: profile.profileImage,
        },
        status: "pending",
      };

      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
        MESSAGES_QUERY_KEY(conversationId),
        (current) => prependMessageToCache(current, optimisticMessage)
      );

      bumpConversationAfterSend(
        queryClient,
        conversationId,
        {
          id: optimisticId,
          content,
          senderId: profile.id,
          createdAt: optimisticMessage.createdAt,
          readAt: null,
        },
        optimisticMessage.createdAt
      );

      return { previousMessages, optimisticId };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          MESSAGES_QUERY_KEY(conversationId),
          context.previousMessages
        );
      } else if (context?.optimisticId) {
        markMessageFailedInCache(
          queryClient,
          conversationId,
          context.optimisticId
        );
      }

      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onSuccess: (serverMessage, _payload, context) => {
      queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
        MESSAGES_QUERY_KEY(conversationId),
        (current) =>
          replaceOptimisticMessageInCache(
            current,
            context?.optimisticId,
            { ...serverMessage, status: "sent" }
          )
      );

      bumpConversationAfterSend(
        queryClient,
        conversationId,
        {
          id: serverMessage.id,
          content: serverMessage.content,
          senderId: serverMessage.senderId,
          createdAt: serverMessage.createdAt,
          readAt: serverMessage.readAt,
        },
        serverMessage.createdAt
      );
    },
  });
};
