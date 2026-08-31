import { useQuery } from "@tanstack/react-query";
import { getAllThreads } from "@/services/api/thread.api";

export const useThreads = () => {
  return useQuery({
    queryKey: ["threads"],
    queryFn: getAllThreads,
  });
};