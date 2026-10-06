import { http } from "@/lib/http";
import {
  profileDraftSchema,
  userFullSchema,
  usernameExistsSchema,
  type ProfileDraft,
  type UserFull,
} from "@/schemas/user";

export async function getUser(userId: string): Promise<UserFull> {
  const data = await http<unknown>(`/api/v1/users/${userId}`);
  return userFullSchema.parse(data);
}

export async function getUserByUsername(username: string): Promise<UserFull> {
  const data = await http<unknown>(`/api/v1/users/username/${encodeURIComponent(username)}`);
  return userFullSchema.parse(data);
}

export async function updateUser(userId: string, draft: ProfileDraft): Promise<UserFull> {
  const payload = profileDraftSchema.parse(draft);
  const data = await http<unknown>(`/api/v1/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return userFullSchema.parse(data);
}

export async function checkUsername(username: string): Promise<{ exists: boolean }> {
  try {
    const data = await http<unknown>(`/api/v1/check_user/${encodeURIComponent(username)}`);
    return usernameExistsSchema.parse(data);
  } catch {
    return { exists: false };
  }
}
