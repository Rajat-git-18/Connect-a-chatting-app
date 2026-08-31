import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "@/services/api/profile.api";
import { PROFILE_ME_QUERY_KEY } from "./useProfile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_ME_QUERY_KEY,
      });
    },
  });
};