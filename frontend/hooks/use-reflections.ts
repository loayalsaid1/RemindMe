"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReflection, deleteReflection, getReflections } from "@/api/reflections";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/hooks/use-toast";
import type { ReflectionDraft } from "@/schemas/reflection";

export function useReflections(reminderId: string | undefined) {
  return useQuery({
    queryKey: reminderId ? queryKeys.reflections.byReminder(reminderId) : queryKeys.reflections.all,
    queryFn: () => getReflections(reminderId as string),
    enabled: Boolean(reminderId),
  });
}

export function useCreateReflection(reminderId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (draft: ReflectionDraft) => createReflection(reminderId, draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections.byReminder(reminderId) });
    },
    onError: () => {
      toast({ title: "Failed to add reflection", variant: "destructive" });
    },
  });
}

export function useDeleteReflection(reminderId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => deleteReflection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections.byReminder(reminderId) });
    },
    onError: () => {
      toast({ title: "Failed to delete reflection", variant: "destructive" });
    },
  });
}
