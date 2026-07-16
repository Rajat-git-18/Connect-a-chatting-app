import { z } from "zod";

export const createThreadSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(120),

  discussion: z
    .string()
    .min(20, "Discussion must be at least 20 characters"),

  category: z.enum([
    "TECHNOLOGY",
    "BUSINESS",
    "EDUCATION",
    "DESIGN",
    "CAREER",
    "LIFESTYLE",
    "OPEN_DISCUSSION",
  ]),

  visibility: z.enum([
    "PUBLIC",
    "FRIENDS",
  ]),

  imageUrl: z.string().url().optional(),

  tags: z.array(z.string()).optional(),
});

export const replySchema = z.object({
  content: z
    .string()
    .min(2)
    .max(5000),

  imageUrl: z.string().url().optional(),
});

export const reactionSchema = z.object({
  type: z.enum([
    "LIKE",
    "HELPFUL",
    "INSIGHTFUL",
    "AGREE",
  ]),
});

export const resolveThreadSchema = z.object({
  replyId: z.string().cuid(),
});