import { z } from "zod";

export const sendConnectionRequestSchema = z.object({
  receiverId: z.string().trim().min(1, "Receiver is required"),
  answer: z
    .string()
    .trim()
    .min(10, "Answer must be at least 10 characters")
    .max(500, "Answer cannot exceed 500 characters"),
});
