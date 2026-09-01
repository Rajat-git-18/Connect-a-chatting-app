import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/services/api/conversation.api";

export const useConversations = () =>
  useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
