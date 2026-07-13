import type { ThreadCategory } from "@/features/thread/constants/thread.constants";
import type { ThreadStatus } from "@/features/thread/data/thread-detail.mock";

export type MyDiscussion = {
  id: string;
  status: ThreadStatus;
  title: string;
  category: ThreadCategory;
  replyCount: number;
  reactionCount: number;
  createdAtLabel: string;
};

export const MY_DISCUSSIONS: MyDiscussion[] = [
  {
    id: "1",
    status: "Open",
    title: "Building in public: what actually works?",
    category: "Open Discussion",
    replyCount: 128,
    reactionCount: 120,
    createdAtLabel: "2h ago",
  },
  {
    id: "2",
    status: "Open",
    title: "Best ways to grow a close-knit network",
    category: "Career",
    replyCount: 86,
    reactionCount: 171,
    createdAtLabel: "5h ago",
  },
  {
    id: "3",
    status: "Solved",
    title: "Design systems that feel human",
    category: "Design",
    replyCount: 54,
    reactionCount: 123,
    createdAtLabel: "Yesterday",
  },
  {
    id: "4",
    status: "Closed",
    title: "Should side projects stay private longer?",
    category: "Business",
    replyCount: 31,
    reactionCount: 48,
    createdAtLabel: "3d ago",
  },
  {
    id: "5",
    status: "Discarded",
    title: "Draft: hiring mentors vs peer circles",
    category: "Education",
    replyCount: 0,
    reactionCount: 2,
    createdAtLabel: "1w ago",
  },
  {
    id: "6",
    status: "Solved",
    title: "How do you structure weekly learning reviews?",
    category: "Lifestyle",
    replyCount: 22,
    reactionCount: 39,
    createdAtLabel: "2w ago",
  },
];

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
