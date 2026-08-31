import api from "./client";
import {
  ConnectionListResponse,
  ConnectionFriendItem,
  ConnectionRequestItem,
  ConnectionStatusResponse,
  ConnectionSuggestionsResponse,
  SendConnectionRequestPayload,
  SendConnectionRequestResponse,
} from "../../types/connection.types";

export const getConnectionSuggestions = async () => {
  const response = await api.get<ConnectionSuggestionsResponse>(
    "/connections/suggestions"
  );
  return response.data.data;
};

export const getConnections = async () => {
  const response = await api.get<ConnectionListResponse<ConnectionFriendItem[]>>(
    "/connections"
  );
  return response.data.data;
};

export const getIncomingConnectionRequests = async () => {
  const response = await api.get<
    ConnectionListResponse<ConnectionRequestItem[]>
  >("/connections/requests/incoming");
  return response.data.data;
};

export const getOutgoingConnectionRequests = async () => {
  const response = await api.get<
    ConnectionListResponse<ConnectionRequestItem[]>
  >("/connections/requests/outgoing");
  return response.data.data;
};

export const getConnectionStatus = async (userId: string) => {
  const response = await api.get<ConnectionStatusResponse>(
    `/connections/status/${userId}`
  );
  return response.data.data;
};

export const sendConnectionRequest = async (
  payload: SendConnectionRequestPayload
) => {
  const response = await api.post<SendConnectionRequestResponse>(
    "/connections/requests",
    payload
  );
  return response.data;
};

export const acceptConnectionRequest = async (requestId: string) => {
  const response = await api.patch<ConnectionListResponse<ConnectionRequestItem>>(
    `/connections/requests/${requestId}/accept`
  );
  return response.data;
};

export const rejectConnectionRequest = async (requestId: string) => {
  const response = await api.patch<ConnectionListResponse<ConnectionRequestItem>>(
    `/connections/requests/${requestId}/reject`
  );
  return response.data;
};

export const cancelConnectionRequest = async (requestId: string) => {
  const response = await api.patch<ConnectionListResponse<ConnectionRequestItem>>(
    `/connections/requests/${requestId}/cancel`
  );
  return response.data;
};
