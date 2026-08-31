import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/api/profile.api";

export const useUserProfile = (userId: string) =>
  useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });