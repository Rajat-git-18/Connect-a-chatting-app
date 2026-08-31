import { useQuery } from "@tanstack/react-query";
import { getOutgoingConnectionRequests } from "@/services/api/connection.api";

export const useOutgoingConnectionRequests = () =>
  useQuery({
    queryKey: ["connections", "outgoing"],
    queryFn: getOutgoingConnectionRequests,
  });
