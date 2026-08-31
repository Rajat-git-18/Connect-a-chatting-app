import type { ThreadStatus } from "@/features/thread/data/thread-detail.mock";
import type { Thread } from "@/types/thread.types";
import {
  formatRelativeTime,
  getCategoryLabel,
  getStatusLabel,
} from "@/features/thread/utils/mapThreadDetail";

export type MyDiscussion = {
  id: string;
  status: ThreadStatus;
  title: string;
  category: string;
  replyCount: number;
  reactionCount: number;
  createdAtLabel: string;
};

export function mapThreadToDiscussion(thread: Thread): MyDiscussion {
  return {
    id: thread.id,
    status: getStatusLabel(thread.status),
    title: thread.title,
    category: getCategoryLabel(thread.category),
    replyCount: thread._count?.replies ?? 0,
    reactionCount: thread._count?.reactions ?? 0,
    createdAtLabel: formatRelativeTime(thread.createdAt),
  };
}

export type DiscussionFilter =
  | "All"
  | "Open"
  | "Solved"
  | "Closed"
  | "Discarded";

export function getDiscussionSummary(items: MyDiscussion[]) {
  return {
    open: items.filter((item) => item.status === "Open").length,
    solved: items.filter((item) => item.status === "Solved").length,
    closed: items.filter((item) => item.status === "Closed").length,
    totalReplies: items.reduce((sum, item) => sum + item.replyCount, 0),
  };
}

export function filterDiscussions(
  items: MyDiscussion[],
  filter: DiscussionFilter
) {
  if (filter === "All") return items;
  return items.filter((item) => item.status === filter);
}
