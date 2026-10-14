"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/hooks/use-toast";
import type { ProfileDraft } from "@/schemas/user";

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (draft: ProfileDraft) => updateUser(userId, draft),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.auth.me, updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast({ title: "Profile updated!" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });
}
