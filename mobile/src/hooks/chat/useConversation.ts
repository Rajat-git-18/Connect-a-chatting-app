import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/services/api/conversation.api";

export const useConversation = (conversationId: string) =>
  useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });
