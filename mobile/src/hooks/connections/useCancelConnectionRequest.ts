import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelConnectionRequest } from "@/services/api/connection.api";
import { invalidateConnectionQueries } from "./invalidateConnectionQueries";

export const useCancelConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelConnectionRequest,
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
    },
  });
};
