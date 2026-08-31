import { useQuery } from "@tanstack/react-query";
import { getConnectionSuggestions } from "@/services/api/connection.api";

export const useConnectionSuggestions = () =>
  useQuery({
    queryKey: ["connections", "suggestions"],
    queryFn: getConnectionSuggestions,
  });
