import { http } from "@/lib/http";
import { ApiError } from "@/lib/api-error";
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
  const validated = profileDraftSchema.parse(draft);

  if (validated.image || validated.remove_image) {
    const formData = new FormData();
    formData.append("first_name", validated.first_name);
    formData.append("last_name", validated.last_name);
    if (validated.description !== undefined) {
      formData.append("description", validated.description);
    }
    if (validated.image) {
      formData.append("profile_image", validated.image);
    }
    if (validated.remove_image) {
      formData.append("remove_image", "true");
    }
    const data = await http<unknown>(`/api/v1/users/${userId}`, {
      method: "PUT",
      body: formData,
    });
    return userFullSchema.parse(data);
  }

  const payload: Record<string, unknown> = {
    first_name: validated.first_name,
    last_name: validated.last_name,
    description: validated.description ?? undefined,
  };

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
  } catch (err) {
    // Only treat a 404 as "username does not exist" — propagate everything else
    if (err instanceof ApiError && err.status === 404) {
      return { exists: false };
    }
    throw err;
  }
}
