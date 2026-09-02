export type ConnectionRelationshipStatus =
  | "SELF"
  | "CONNECTED"
  | "PENDING_SENT"
  | "PENDING_RECEIVED"
  | "NO_QUESTION"
  | "NONE";

export interface ConnectionSuggestion {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
  bio: string | null;
  hasConnectionQuestion: boolean;
}

export interface ConnectionStatus {
  status: ConnectionRelationshipStatus;
  requestId?: string;
  connectionId?: string;
}

export interface SendConnectionRequestPayload {
  receiverId: string;
  answer: string;
}

export interface ConnectionSuggestionsResponse {
  success: boolean;
  message: string;
  data: ConnectionSuggestion[];
}

export interface ConnectionStatusResponse {
  success: boolean;
  message: string;
  data: ConnectionStatus;
}

export interface SendConnectionRequestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    receiverId: string;
    status: string;
    createdAt: string;
    receiver: {
      id: string;
      displayName: string;
      username: string;
    };
  };
}

export interface ConnectionUserSummary {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
  bio: string | null;
}

export interface ConnectionRequestItem {
  id: string;
  status: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  sender: ConnectionUserSummary;
  receiver: ConnectionUserSummary;
  question: {
    id: string;
    question: string;
  };
}

export interface ConnectionFriendItem {
  id: string;
  connectedAt: string;
  user: ConnectionUserSummary;
}

export interface ConnectionListResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type FriendsTabKey = "connected" | "incoming" | "sent";

