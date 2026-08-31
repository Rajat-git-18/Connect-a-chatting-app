import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReply } from "@/services/api/thread.api";

export const useCreateReply = (threadId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createReply(threadId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });
};
