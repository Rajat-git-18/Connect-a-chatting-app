import { useQuery } from "@tanstack/react-query";
import { getUserGetToKnowMe } from "@/services/api/getToKnowMe.api";

export const useUserGetToKnowMe = (userId: string) =>
  useQuery({
    queryKey: ["get-to-know-me", "user", userId],
    queryFn: () => getUserGetToKnowMe(userId),
    enabled: !!userId,
  });
