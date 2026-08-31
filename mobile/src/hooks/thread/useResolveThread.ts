import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveThread } from "@/services/api/thread.api";

export const useResolveThread = (threadId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: string) => resolveThread(threadId, replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });
};
