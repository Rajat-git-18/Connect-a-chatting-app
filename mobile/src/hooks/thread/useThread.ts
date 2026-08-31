import { useQuery } from "@tanstack/react-query";
import { getThreadById } from "@/services/api/thread.api";

export const useThread = (threadId: string) => {
  return useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThreadById(threadId),
    enabled: !!threadId,
    // Always pull fresh data when the screen is (re)opened so reaction
    // changes made earlier are reflected instead of showing stale cache.
    staleTime: 0,
    refetchOnMount: "always",
  });
};