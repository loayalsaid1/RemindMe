"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReminder, deleteReminder, getPublicReminders, getUserReminders, updateReminder } from "@/api/reminders";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/hooks/use-toast";
import type { ReminderDraft } from "@/schemas/reminder";

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

export function useUserReminders(userId: string | undefined, isOwn: boolean) {
  return useQuery({
    queryKey: userId ? queryKeys.reminders.user(userId) : queryKeys.reminders.all,
    queryFn: async () => {
      if (!userId) return [];
      if (isOwn) return getUserReminders(userId);
      const all = await getPublicReminders();
      return all.filter((item) => item.user_id === userId);
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
      patch: {
        text?: string | null;
        caption?: string | null;
        public?: boolean;
        is_text?: boolean;
        image?: File | null;
      };
    }) => updateReminder(id, patch),
    onSuccess: (_updated, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all });
      const onlyVisibility =
        variables.patch.public !== undefined &&
        variables.patch.text === undefined &&
        variables.patch.caption === undefined &&
        !variables.patch.image;
      toast({
        title: onlyVisibility
          ? variables.patch.public
            ? "Set to public"
            : "Set to private"
          : "Reminder updated",
      });
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
