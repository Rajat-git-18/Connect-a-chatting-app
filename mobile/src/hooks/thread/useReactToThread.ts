import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactToThread } from "@/services/api/thread.api";
import type { ReactionType } from "@/types/thread.types";

export const useReactToThread = (threadId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type: ReactionType) => reactToThread(threadId, type),
    onSuccess: () => {
      // Soft refresh so other users' counts stay accurate without fighting optimistic UI.
      queryClient.invalidateQueries({
        queryKey: ["thread", threadId],
        refetchType: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });
};
