import { useQuery } from "@tanstack/react-query";
import { getConnectionStatus } from "@/services/api/connection.api";

export const useConnectionStatus = (userId: string) =>
  useQuery({
    queryKey: ["connections", "status", userId],
    queryFn: () => getConnectionStatus(userId),
    enabled: !!userId,
  });
