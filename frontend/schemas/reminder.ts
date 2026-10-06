import { z } from "zod";

export const reminderFullSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    text: z.string().nullable().optional().default(null),
    caption: z.string().nullable().optional().default(null),
    is_text: z.boolean(),
    public: z.boolean(),
    img_url: z.string().nullable().optional().default(null),
    created_at: z.string(),
    updated_at: z.string(),
  })
  .passthrough();

export const reminderListSchema = z.array(reminderFullSchema);

export const reminderDraftSchema = z.object({
  tab: z.enum(["text", "image"]),
  text: z.string().optional(),
  caption: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  image: z.instanceof(File).nullable().optional(),
});

export type ReminderFull = z.infer<typeof reminderFullSchema>;
export type ReminderDraft = z.infer<typeof reminderDraftSchema>;
