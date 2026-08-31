import { useQuery } from "@tanstack/react-query";
import { getConnections } from "@/services/api/connection.api";

export const useConnections = () =>
  useQuery({
    queryKey: ["connections", "list"],
    queryFn: getConnections,
  });
