import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactToReply } from "@/services/api/thread.api";
import type { ReactionType } from "@/types/thread.types";

export const useReactToReply = (threadId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      replyId,
      type,
    }: {
      replyId: string;
      type: ReactionType;
    }) => reactToReply(threadId, replyId, type),
    onSuccess: () => {
      // Don't refetch the OPEN thread now — that would overwrite the optimistic
      // toggle mid-interaction. Just mark it stale so it refetches fresh when
      // the screen is reopened.
      queryClient.invalidateQueries({
        queryKey: ["thread", threadId],
        refetchType: "none",
      });
      // The home list stays mounted underneath, so refetch it so its reaction
      // count updates live.
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });
};
