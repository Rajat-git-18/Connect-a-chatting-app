import type {
  Reaction,
  ReactionType,
  Reply,
  ThreadCategory,
  ThreadDetail as ApiThreadDetail,
  ThreadStatus as ApiThreadStatus,
} from "@/types/thread.types";
import type {
  ReplySort,
  ThreadDetail,
  ThreadReactionKey,
  ThreadReply,
  ThreadStatus,
} from "../data/thread-detail.mock";

export type { ThreadReactionKey };

const CATEGORY_LABELS: Record<ThreadCategory, string> = {
  TECHNOLOGY: "Technology",
  BUSINESS: "Business",
  EDUCATION: "Education",
  DESIGN: "Design",
  CAREER: "Career",
  LIFESTYLE: "Lifestyle",
  OPEN_DISCUSSION: "Open Discussion",
};

export function getCategoryLabel(category: ThreadCategory): string {
  return CATEGORY_LABELS[category] ?? category;
}

const STATUS_LABELS: Record<ApiThreadStatus, ThreadStatus> = {
  OPEN: "Open",
  SOLVED: "Solved",
  CLOSED: "Closed",
};

export function getStatusLabel(status: ApiThreadStatus): ThreadStatus {
  return STATUS_LABELS[status] ?? "Open";
}

export const UI_TO_API_REACTION: Record<ThreadReactionKey, ReactionType> = {
  helpful: "HELPFUL",
  insightful: "INSIGHTFUL",
  appreciate: "LIKE",
  agree: "AGREE",
};

export const API_TO_UI_REACTION: Record<ReactionType, ThreadReactionKey> = {
  HELPFUL: "helpful",
  INSIGHTFUL: "insightful",
  LIKE: "appreciate",
  AGREE: "agree",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function formatRelativeTime(dateInput: string): string {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) return "";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

function countReactions(
  reactions: Reaction[] | undefined,
  type: ReactionType
): number {
  return (reactions ?? []).filter((reaction) => reaction.type === type).length;
}

function buildReactionCounts(
  reactions: Reaction[] | undefined
): Record<ThreadReactionKey, number> {
  return {
    helpful: countReactions(reactions, "HELPFUL"),
    insightful: countReactions(reactions, "INSIGHTFUL"),
    appreciate: countReactions(reactions, "LIKE"),
    agree: countReactions(reactions, "AGREE"),
  };
}

function mapReply(reply: Reply): ThreadReply {
  return {
    id: reply.id,
    authorName: reply.author.displayName,
    authorInitials: getInitials(reply.author.displayName),
    createdAtLabel: formatRelativeTime(reply.createdAt),
    body: reply.content,
    imageUri: reply.imageUrl ?? undefined,
    helpful: countReactions(reply.reactions, "HELPFUL"),
    insightful: countReactions(reply.reactions, "INSIGHTFUL"),
    appreciate: countReactions(reply.reactions, "LIKE"),
    agree: countReactions(reply.reactions, "AGREE"),
    isBest: reply.isBestReply,
  };
}

/** Totals across thread + all reply reactions. */
export function getThreadReactionTotals(
  thread: ApiThreadDetail
): Record<ThreadReactionKey, number> {
  const allReactions = [
    ...(thread.reactions ?? []),
    ...(thread.replies ?? []).flatMap((reply) => reply.reactions ?? []),
  ];

  return buildReactionCounts(allReactions);
}

export function mapApiThreadToUi(thread: ApiThreadDetail): ThreadDetail {
  return {
    id: thread.id,
    status: STATUS_LABELS[thread.status] ?? "Open",
    category: (CATEGORY_LABELS[thread.category] ??
      thread.category) as ThreadDetail["category"],
    title: thread.title,
    authorName: thread.author.displayName,
    authorInitials: getInitials(thread.author.displayName),
    createdAtLabel: formatRelativeTime(thread.createdAt),
    body: thread.discussion,
    imageUri: thread.imageUrl ?? undefined,
    tags: (thread.tags ?? []).map((item) => item.tag.name),
    reactions: getThreadReactionTotals(thread),
    replies: (thread.replies ?? []).map(mapReply),
  };
}

export function sortReplies(
  replies: ThreadReply[],
  sort: ReplySort
): ThreadReply[] {
  const copy = [...replies];

  // API returns replies oldest → newest.
  if (sort === "most_helpful") {
    return copy.sort((a, b) => b.helpful - a.helpful);
  }

  if (sort === "newest") {
    return copy.reverse();
  }

  return copy;
}
