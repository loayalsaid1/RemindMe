"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserByUsername } from "@/api/users";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/lib/api-error";

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
