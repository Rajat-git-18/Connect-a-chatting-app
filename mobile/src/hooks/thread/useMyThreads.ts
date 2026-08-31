import { useQuery } from "@tanstack/react-query";
import { getMyThreads } from "@/services/api/thread.api";

export const useMyThreads = () => {
  return useQuery({
    queryKey: ["threads", "mine"],
    queryFn: getMyThreads,
    staleTime: 0,
    refetchOnMount: "always",
  });
};
