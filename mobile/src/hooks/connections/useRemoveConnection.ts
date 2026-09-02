import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeConnection } from "@/services/api/connection.api";
import { invalidateConnectionQueries } from "./invalidateConnectionQueries";

export const useRemoveConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: string) => removeConnection(connectionId),
    onSuccess: () => {
      invalidateConnectionQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
