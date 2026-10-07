import { z } from "zod";

export const reflectionFullSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    reminder_id: z.string(),
    content: z.string(),
    updated_at: z.string(),
    user_full_name: z.string().optional().default(""),
    username: z.string().optional().default(""),
    user_img_url: z.string().nullable().optional().default(null),
  })
  .passthrough();

export const reflectionListSchema = z.array(reflectionFullSchema);

export const reflectionDraftSchema = z.object({
  content: z.string().min(1, "Write a reflection"),
});

export type ReflectionFull = z.infer<typeof reflectionFullSchema>;
export type ReflectionDraft = z.infer<typeof reflectionDraftSchema>;
