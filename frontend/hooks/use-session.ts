"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, login, logout, registerUser } from "@/api/auth";
import { queryKeys } from "@/lib/query-keys";
import type { LoginDraft, RegisterDraft, UserFull } from "@/schemas/user";
import { ApiError } from "@/lib/api-error";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (draft: LoginDraft) => login(draft),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
      router.push("/");
      router.refresh();
    },
  });
}

export function useRegister() {
  const loginMutation = useLogin();
  return useMutation({
    mutationFn: async (draft: RegisterDraft) => {
      await registerUser(draft);
      return loginMutation.mutateAsync({
        identifier: draft.email,
        password: draft.password,
        remember: true,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
    onError: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export type { UserFull };
