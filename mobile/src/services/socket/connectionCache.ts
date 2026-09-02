import type { QueryClient } from "@tanstack/react-query";
import type {
  ConnectionFriendItem,
  ConnectionRequestItem,
} from "@/types/connection.types";
import type {
  ConnectionNewPayload,
  ConnectionRemovedPayload,
} from "@/services/socket/chat.events";

export const INCOMING_REQUESTS_QUERY_KEY = ["connections", "incoming"] as const;
export const OUTGOING_REQUESTS_QUERY_KEY = ["connections", "outgoing"] as const;
export const CONNECTIONS_QUERY_KEY = ["connections"] as const;

function upsertRequest(
  current: ConnectionRequestItem[] | undefined,
  request: ConnectionRequestItem
) {
  if (!current) return [request];

  if (current.some((item) => item.id === request.id)) {
    return current;
  }

  return [request, ...current];
}

export function prependIncomingRequest(
  queryClient: QueryClient,
  request: ConnectionRequestItem,
  currentUserId: string | undefined
) {
  if (!currentUserId || request.receiver.id !== currentUserId) return;

  queryClient.setQueryData<ConnectionRequestItem[]>(
    INCOMING_REQUESTS_QUERY_KEY,
    (current) => upsertRequest(current, request)
  );
}

export function prependOutgoingRequest(
  queryClient: QueryClient,
  request: ConnectionRequestItem,
  currentUserId: string | undefined
) {
  if (!currentUserId || request.sender.id !== currentUserId) return;

  queryClient.setQueryData<ConnectionRequestItem[]>(
    OUTGOING_REQUESTS_QUERY_KEY,
    (current) => upsertRequest(current, request)
  );
}

export function removeConnectionRequestFromCache(
  queryClient: QueryClient,
  requestId: string
) {
  queryClient.setQueryData<ConnectionRequestItem[]>(
    INCOMING_REQUESTS_QUERY_KEY,
    (current) => current?.filter((item) => item.id !== requestId) ?? current
  );

  queryClient.setQueryData<ConnectionRequestItem[]>(
    OUTGOING_REQUESTS_QUERY_KEY,
    (current) => current?.filter((item) => item.id !== requestId) ?? current
  );
}

export function prependConnectionToCache(
  queryClient: QueryClient,
  connection: ConnectionNewPayload
) {
  queryClient.setQueryData<ConnectionFriendItem[]>(
    CONNECTIONS_QUERY_KEY,
    (current) => {
      if (!current) {
        return [
          {
            id: connection.id,
            connectedAt: connection.connectedAt,
            user: connection.user,
          },
        ];
      }

      if (current.some((item) => item.id === connection.id)) {
        return current;
      }

      return [
        {
          id: connection.id,
          connectedAt: connection.connectedAt,
          user: connection.user,
        },
        ...current,
      ];
    }
  );
}

export function removeConnectionFromCache(
  queryClient: QueryClient,
  payload: ConnectionRemovedPayload
) {
  queryClient.setQueryData<ConnectionFriendItem[]>(
    CONNECTIONS_QUERY_KEY,
    (current) =>
      current?.filter((item) => item.id !== payload.connectionId) ?? current
  );

  void queryClient.invalidateQueries({
    queryKey: ["connections", "status", payload.otherUserId],
  });
}

export function invalidateConnectionSuggestions(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ["connections", "suggestions"] });
}
