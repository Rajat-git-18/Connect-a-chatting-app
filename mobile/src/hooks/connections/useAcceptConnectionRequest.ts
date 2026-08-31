import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptConnectionRequest } from "@/services/api/connection.api";
import { invalidateConnectionQueries } from "./invalidateConnectionQueries";

export const useAcceptConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptConnectionRequest,
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};
