import { useQuery } from "@tanstack/react-query";
import { getIncomingConnectionRequests } from "@/services/api/connection.api";

export const useIncomingConnectionRequests = () =>
  useQuery({
    queryKey: ["connections", "incoming"],
    queryFn: getIncomingConnectionRequests,
  });
