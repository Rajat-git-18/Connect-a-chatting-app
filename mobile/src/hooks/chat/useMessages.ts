import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/services/api/conversation.api";

export const useMessages = (conversationId: string) =>
  useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam }) =>
      getMessages(conversationId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!conversationId,
  });
