import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectConnectionRequest } from "@/services/api/connection.api";
import { invalidateConnectionQueries } from "./invalidateConnectionQueries";

export const useRejectConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectConnectionRequest,
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};
