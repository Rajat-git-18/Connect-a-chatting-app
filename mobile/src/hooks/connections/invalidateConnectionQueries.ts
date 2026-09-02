export function invalidateConnectionQueries(
  queryClient: import("@tanstack/react-query").QueryClient
) {
  queryClient.invalidateQueries({ queryKey: ["connections"] });
  queryClient.invalidateQueries({ queryKey: ["connections", "status"] });
}
