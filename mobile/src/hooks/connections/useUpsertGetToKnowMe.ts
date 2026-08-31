import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertMyGetToKnowMe } from "@/services/api/getToKnowMe.api";

export const useUpsertGetToKnowMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertMyGetToKnowMe,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-to-know-me", "me"],
      });
    },
  });
};
