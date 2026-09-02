export type ConnectionRelationshipStatus =
  | "SELF"
  | "CONNECTED"
  | "PENDING_SENT"
  | "PENDING_RECEIVED"
  | "NO_QUESTION"
  | "NONE";

export interface SendConnectionRequestBody {
  receiverId: string;
  answer: string;
}

export interface ConnectionSuggestion {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
  bio: string | null;
  hasConnectionQuestion: boolean;
}

export interface ConnectionStatusData {
  status: ConnectionRelationshipStatus;
  requestId?: string;
  connectionId?: string;
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
  createdAt: Date;
  updatedAt: Date;
  sender: ConnectionUserSummary;
  receiver: ConnectionUserSummary;
  question: {
    id: string;
    question: string;
  };
}

export interface ConnectionFriendItem {
  id: string;
  connectedAt: Date;
  user: ConnectionUserSummary;
}

