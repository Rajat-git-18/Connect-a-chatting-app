import { z } from "zod";

export const createConversationSchema = z.object({
  otherUserId: z.string().trim().min(1, "Other user is required"),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(4000, "Message cannot exceed 4000 characters"),
});

export const listMessagesQuerySchema = z.object({
  cursor: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
