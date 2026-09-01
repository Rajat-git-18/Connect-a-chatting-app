import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markConversationRead } from "@/services/api/conversation.api";

export const useMarkConversationRead = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markConversationRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
