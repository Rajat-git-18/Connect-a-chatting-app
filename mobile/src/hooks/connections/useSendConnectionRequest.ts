import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendConnectionRequest } from "@/services/api/connection.api";
import { invalidateConnectionQueries } from "./invalidateConnectionQueries";

export const useSendConnectionRequest = (receiverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendConnectionRequest,
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["connections", "status", receiverId],
      });
    },
  });
};
