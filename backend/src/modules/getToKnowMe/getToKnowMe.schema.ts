import { z } from "zod";

export const upsertGetToKnowMeSchema = z.object({
  question: z
    .string()
    .trim()
    .min(10, "Question must be at least 10 characters")
    .max(200, "Question cannot exceed 200 characters"),
});
