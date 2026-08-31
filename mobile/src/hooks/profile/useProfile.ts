import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/services/api/profile.api";

export const PROFILE_ME_QUERY_KEY = ["users", "me"] as const;

export const useProfile = () =>
  useQuery({
    queryKey: PROFILE_ME_QUERY_KEY,
    queryFn: getMyProfile,
    staleTime: 0,
  });