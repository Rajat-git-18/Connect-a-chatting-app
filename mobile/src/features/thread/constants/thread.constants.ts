export const THREAD_CATEGORIES = [
  "Technology",
  "Career",
  "Business",
  "Education",
  "Design",
  "Lifestyle",
  "Open Discussion",
] as const;

export type ThreadCategory = (typeof THREAD_CATEGORIES)[number];

export const SUGGESTED_TAGS = [
  "Advice",
  "Question",
  "Feedback",
  "Learning",
  "Opportunity",
  "Story",
] as const;

export type ThreadVisibility = "public" | "friends";
