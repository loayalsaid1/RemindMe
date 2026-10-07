import { http } from "@/lib/http";
import {
  reminderFullSchema,
  reminderListSchema,
  type ReminderDraft,
  type ReminderFull,
} from "@/schemas/reminder";

export async function getPublicReminders(): Promise<ReminderFull[]> {
  const data = await http<unknown>("/api/v1/reminders");
  return reminderListSchema.parse(data);
}

export async function getPublicReminder(id: string): Promise<ReminderFull> {
  const data = await http<unknown>(`/api/v1/reminders/${id}`);
  return reminderFullSchema.parse(data);
}

export async function getUserReminders(userId: string): Promise<ReminderFull[]> {
  const data = await http<unknown>(`/api/v1/users/${userId}/reminders`);
  return reminderListSchema.parse(data);
}

export async function createReminder(draft: ReminderDraft): Promise<ReminderFull> {
  if (draft.tab === "image") {
    if (!draft.image) {
      throw new Error("Please select an image");
    }
    const formData = new FormData();
    formData.append("reminder_image", draft.image);
    if (draft.caption) formData.append("caption", draft.caption);
    formData.append("is_text", "false");
    formData.append("public", String(draft.visibility === "public"));
    const data = await http<unknown>("/api/v1/reminders", {
      method: "POST",
      body: formData,
    });
    return reminderFullSchema.parse(data);
  }

  const data = await http<unknown>("/api/v1/reminders", {
    method: "POST",
    body: JSON.stringify({
      text: draft.text,
      caption: draft.caption || undefined,
      is_text: true,
      public: draft.visibility === "public",
    }),
  });
  return reminderFullSchema.parse(data);
}

export async function updateReminder(
  id: string,
  patch: Partial<Pick<ReminderFull, "text" | "caption" | "public">>
): Promise<ReminderFull> {
  const data = await http<unknown>(`/api/v1/reminders/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
  return reminderFullSchema.parse(data);
}

export async function deleteReminder(id: string): Promise<void> {
  await http<unknown>(`/api/v1/reminders/${id}`, { method: "DELETE" });
}
