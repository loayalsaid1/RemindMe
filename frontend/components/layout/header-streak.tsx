"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserFull } from "@/schemas/user";

interface HeaderStreakProps {
  user: UserFull | null | undefined;
  className?: string;
}

export function HeaderStreak({ user, className }: HeaderStreakProps) {
  if (!user) return null;

  const currentStreak = user.current_streak?.days ?? 0;
  const longestStreak = user.longest_streak?.days ?? 0;

  return (
    <Link
      href={`/user/${user.user_name}`}
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-white/10 active:scale-95",
        className
      )}
      title={`Current Streak: ${currentStreak} days • Longest Streak: ${longestStreak} days`}
      aria-label={`Streak: ${currentStreak} days. Tap to view profile.`}
    >
      <Flame
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          currentStreak > 0
            ? "text-primary streak-glow"
            : "text-muted-foreground"
        )}
      />
      <span className="font-bold tracking-tight">{currentStreak}</span>
    </Link>
  );
}

