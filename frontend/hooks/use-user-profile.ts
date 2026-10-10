"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByUsername, updateUser } from "@/api/users";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-error";
import { useToast } from "@/hooks/use-toast";
import type { ProfileDraft } from "@/schemas/user";

export function useUserByUsername(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.username(username),
    queryFn: () => getUserByUsername(username),
    enabled: Boolean(username) && enabled,
    retry: (count, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return count < 1;
    },
  });
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (draft: ProfileDraft) => updateUser(userId, draft),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast({ title: "Profile updated" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
}
