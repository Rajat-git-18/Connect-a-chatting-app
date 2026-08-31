import { useQuery } from "@tanstack/react-query";
import { getMyGetToKnowMe } from "@/services/api/getToKnowMe.api";

export const useGetToKnowMe = () =>
  useQuery({
    queryKey: ["get-to-know-me", "me"],
    queryFn: getMyGetToKnowMe,
  });
