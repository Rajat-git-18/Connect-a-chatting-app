export type ThreadStatus = "OPEN" | "SOLVED" | "CLOSED";

export type ThreadVisibility = "PUBLIC" | "FRIENDS";

export type ThreadCategory =
  | "TECHNOLOGY"
  | "BUSINESS"
  | "EDUCATION"
  | "DESIGN"
  | "CAREER"
  | "LIFESTYLE"
  | "OPEN_DISCUSSION";

export type ReactionType =
  | "LIKE"
  | "HELPFUL"
  | "INSIGHTFUL"
  | "AGREE";

export interface ThreadAuthor {
  id: string;
  username: string;
  displayName: string;
  profileImage: string | null;
  bio?: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ThreadTag {
  threadId: string;
  tagId: string;
  tag: Tag;
}

export interface ThreadCounts {
  replies: number;
  reactions: number;
}

export interface ReactionUser {
  id: string;
  username: string;
}

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  threadId?: string | null;
  replyId?: string | null;
  createdAt: string;
  user?: ReactionUser;
}

export interface Reply {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  threadId: string;
  authorId: string;
  isBestReply: boolean;
  author: ThreadAuthor;
  reactions: Reaction[];
}

export interface Thread {
  id: string;
  title: string;
  discussion: string;
  imageUrl: string | null;
  category: ThreadCategory;
  visibility: ThreadVisibility;
  status: ThreadStatus;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: ThreadAuthor;
  tags: ThreadTag[];
  _count: ThreadCounts;
}

export interface ThreadDetail extends Thread {
  replies: Reply[];
  reactions: Reaction[];
}

export interface GetThreadsResponse {
  success: boolean;
  message: string;
  data: Thread[];
}

export interface GetThreadResponse {
  success: boolean;
  message: string;
  data: ThreadDetail;
}

export interface CreateThreadRequest {
  title: string;
  discussion: string;
  category: ThreadCategory;
  visibility: ThreadVisibility;
  tags: string[];
  imageUrl?: string;
}
