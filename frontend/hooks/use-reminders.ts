"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReminder, deleteReminder, getPublicReminders, getUserReminders, updateReminder } from "@/api/reminders";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/hooks/use-toast";
import type { ReminderDraft, ReminderFull } from "@/schemas/reminder";
import { reminderListSchema } from "@/schemas/reminder";
import { http } from "@/lib/http";

export function useMyReminders(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reminders.mine,
    queryFn: () => getUserReminders(userId as string),
    enabled: Boolean(userId),
  });
}

export function usePublicReminders() {
  return useQuery({
    queryKey: queryKeys.reminders.public,
    queryFn: getPublicReminders,
  });
}

async function getPublicUserReminders(userId: string): Promise<ReminderFull[]> {
  // Uses the same authenticated endpoint — for non-owners this only returns public reminders
  // because the backend filters by public=True for other users.
  // Fall back to filtering the public wall if the route 403s.
  try {
    const data = await http<unknown>(`/api/v1/users/${userId}/reminders`);
    return reminderListSchema.parse(data);
  } catch {
    const all = await getPublicReminders();
    return all.filter((item) => item.user_id === userId);
  }
}

export function useUserReminders(userId: string | undefined, isOwn: boolean) {
  return useQuery({
    queryKey: userId ? queryKeys.reminders.user(userId) : queryKeys.reminders.all,
    queryFn: async () => {
      if (!userId) return [];
      return isOwn ? getUserReminders(userId) : getPublicUserReminders(userId);
    },
    enabled: Boolean(userId),
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (draft: ReminderDraft) => createReminder(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all });
      toast({ title: "Reminder created!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create reminder",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<ReminderFull, "text" | "caption" | "public">>;
      toastMessage?: string;
    }) => updateReminder(id, patch),
    onSuccess: (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all });
      const msg =
        variables.toastMessage ??
        (updated.public ? "Set to public" : "Set to private");
      toast({ title: msg });
    },
    onError: () => {
      toast({ title: "Failed to update", variant: "destructive" });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all });
      toast({ title: "Reminder deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete", variant: "destructive" });
    },
  });
}
