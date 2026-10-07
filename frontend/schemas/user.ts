import { z } from "zod";

export const streakSchema = z
  .object({
    days: z.number().int().nonnegative().catch(0),
  })
  .passthrough();

export const userFullSchema = z
  .object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    user_name: z.string(),
    email: z.string().email().or(z.string()),
    img_url: z.string().nullable().optional().default(null),
    description: z.string().nullable().optional().default(null),
    current_streak: streakSchema.nullable().optional().transform((value) => value ?? { days: 0 }),
    longest_streak: streakSchema.nullable().optional().transform((value) => value ?? { days: 0 }),
  })
  .passthrough();

export const userListSchema = z.array(userFullSchema);

export const loginDraftSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email or username"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

export const registerDraftSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agreed: z.boolean().refine((value) => value === true, {
    message: "Please accept the terms",
  }),
});

export const profileDraftSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  description: z.string().optional(),
  img_url: z.string().nullable().optional(),
});

export const usernameExistsSchema = z.object({
  exists: z.boolean(),
});

export type UserFull = z.infer<typeof userFullSchema>;
export type LoginDraft = z.infer<typeof loginDraftSchema>;
export type RegisterDraft = z.infer<typeof registerDraftSchema>;
export type ProfileDraft = z.infer<typeof profileDraftSchema>;
