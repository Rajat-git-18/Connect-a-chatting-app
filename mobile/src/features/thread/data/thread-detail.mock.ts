import type { ThreadCategory } from "../constants/thread.constants";

export type ThreadStatus = "Open" | "Solved" | "Closed" | "Discarded";

export type ThreadReactionKey = "helpful" | "insightful" | "appreciate" | "agree";

export type ReplySort = "most_helpful" | "newest" | "oldest";

export type ThreadReply = {
  id: string;
  authorName: string;
  authorInitials: string;
  createdAtLabel: string;
  body: string;
  imageUri?: string;
  helpful: number;
  insightful: number;
  agree: number;
  isBest?: boolean;
};

export type ThreadDetail = {
  id: string;
  status: ThreadStatus;
  category: ThreadCategory;
  title: string;
  authorName: string;
  authorInitials: string;
  createdAtLabel: string;
  body: string;
  imageUri?: string;
  tags: string[];
  reactions: Record<ThreadReactionKey, number>;
  replies: ThreadReply[];
};

export const THREAD_DETAILS: Record<string, ThreadDetail> = {
  "1": {
    id: "1",
    status: "Open",
    category: "Open Discussion",
    title: "Building in public: what actually works?",
    authorName: "Aanya Mehta",
    authorInitials: "AM",
    createdAtLabel: "2h ago",
    body:
      "I’ve been sharing weekly progress on a side project for three months. Some updates get thoughtful replies; others disappear.\n\nWhat formats have consistently sparked useful discussion for you — demos, lessons learned, or honest blockers? Looking for patterns that invite conversation, not vanity metrics.",
    imageUri: undefined,
    tags: ["Advice", "Learning", "Story"],
    reactions: {
      helpful: 42,
      insightful: 28,
      appreciate: 19,
      agree: 31,
    },
    replies: [
      {
        id: "r1",
        authorName: "Noah Patel",
        authorInitials: "NP",
        createdAtLabel: "1h ago",
        body:
          "Ship a concrete decision each week and explain the tradeoff you rejected. People engage when they can argue with a choice — not when they only see a changelog.",
        helpful: 36,
        insightful: 22,
        agree: 18,
      },
      {
        id: "r2",
        authorName: "Priya Shah",
        authorInitials: "PS",
        createdAtLabel: "48m ago",
        body:
          "I’ve had the best luck with “one failure + one fix.” It feels human and gives others a reusable playbook without turning into a diary.",
        helpful: 14,
        insightful: 9,
        agree: 11,
      },
      {
        id: "r3",
        authorName: "Leo Kim",
        authorInitials: "LK",
        createdAtLabel: "22m ago",
        body:
          "Ask one specific question at the end. Open-ended “thoughts?” rarely converts. “Would you ship this MVP or wait for analytics?” does.",
        helpful: 8,
        insightful: 12,
        agree: 6,
      },
    ],
  },
  "2": {
    id: "2",
    status: "Open",
    category: "Career",
    title: "Best ways to grow a close-knit network",
    authorName: "Marcus Chen",
    authorInitials: "MC",
    createdAtLabel: "5h ago",
    body:
      "I’m trying to build a smaller circle of people I can learn from weekly — not a large follower count.\n\nHow do you keep relationships warm without turning every chat into a request?",
    tags: ["Advice", "Opportunity"],
    reactions: {
      helpful: 61,
      insightful: 44,
      appreciate: 27,
      agree: 39,
    },
    replies: [
      {
        id: "r1",
        authorName: "Elena Rossi",
        authorInitials: "ER",
        createdAtLabel: "3h ago",
        body:
          "A monthly “what I’m learning” note to 8–10 people beats random LinkedIn likes. Consistency signals care without asking for favors.",
        helpful: 41,
        insightful: 33,
        agree: 24,
      },
      {
        id: "r2",
        authorName: "Jordan Lee",
        authorInitials: "JL",
        createdAtLabel: "2h ago",
        body:
          "Offer context before asking. Share a useful resource related to their work first. Reciprocity compounds quietly.",
        helpful: 19,
        insightful: 15,
        agree: 12,
      },
    ],
  },
  "3": {
    id: "3",
    status: "Solved",
    category: "Design",
    title: "Design systems that feel human",
    authorName: "Sofia Alvarez",
    authorInitials: "SA",
    createdAtLabel: "Yesterday",
    body:
      "Most design systems optimize for consistency and lose warmth. I’m exploring how to keep tokens strict while still allowing moments of personality in product UI.\n\nWhere do you draw the line between system rules and expressive exceptions?",
    tags: ["Feedback", "Learning"],
    reactions: {
      helpful: 33,
      insightful: 51,
      appreciate: 22,
      agree: 17,
    },
    replies: [
      {
        id: "r1",
        authorName: "Dev Sharma",
        authorInitials: "DS",
        createdAtLabel: "18h ago",
        body:
          "Treat expression as a documented layer: illustration, empty states, and onboarding can bend rules. Core flows stay strict. Document the exceptions so they don’t become tribal knowledge.",
        helpful: 29,
        insightful: 40,
        agree: 21,
        isBest: true,
      },
      {
        id: "r2",
        authorName: "Maya Brooks",
        authorInitials: "MB",
        createdAtLabel: "12h ago",
        body:
          "We allow one “signature moment” per screen — never more. That constraint keeps personality intentional instead of decorative noise.",
        helpful: 11,
        insightful: 16,
        agree: 9,
      },
    ],
  },
};

export function getThreadDetail(id: string): ThreadDetail | null {
  return THREAD_DETAILS[id] ?? null;
}

export function getDefaultThreadDetail(): ThreadDetail {
  return THREAD_DETAILS["1"];
}
