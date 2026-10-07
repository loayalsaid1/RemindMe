import { http } from "@/lib/http";
import {
  reflectionDraftSchema,
  reflectionFullSchema,
  reflectionListSchema,
  type ReflectionDraft,
  type ReflectionFull,
} from "@/schemas/reflection";

export async function getReflections(reminderId: string): Promise<ReflectionFull[]> {
  const data = await http<unknown>(`/api/v1/reminders/${reminderId}/reflections`);
  return reflectionListSchema.parse(data);
}

export async function createReflection(
  reminderId: string,
  draft: ReflectionDraft
): Promise<ReflectionFull> {
  const payload = reflectionDraftSchema.parse(draft);
  const data = await http<unknown>(`/api/v1/reminders/${reminderId}/reflections`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return reflectionFullSchema.parse(data);
}

export async function deleteReflection(id: string): Promise<void> {
  await http<unknown>(`/api/v1/reflections/${id}`, { method: "DELETE" });
}
