export function invalidateConnectionQueries(
  queryClient: import("@tanstack/react-query").QueryClient
) {
  queryClient.invalidateQueries({ queryKey: ["connections"] });
}
