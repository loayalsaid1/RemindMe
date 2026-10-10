"use client";

import type { ReminderFull } from "@/schemas/reminder";
import { ReminderCard } from "@/components/reminders/reminder-card";

interface ReminderGridProps {
  reminders: ReminderFull[];
  isOwner?: boolean;
  onShowReflections?: (reminder: ReminderFull) => void;
  isLoading?: boolean;
}

export function ReminderGrid({
  reminders,
  isOwner = false,
  onShowReflections,
  isLoading = false,
}: ReminderGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="surface-card surface-enter-stagger aspect-[16/10] animate-pulse rounded-xl border border-white/10"
          />
        ))}
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="surface-enter flex flex-col items-center justify-center px-4 py-20 text-center text-muted-foreground">
        <p className="text-lg font-medium">Your E-Wall seems empty</p>
        <p className="mt-1 text-sm">Add your first reminder to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          isOwner={isOwner}
          onShowReflections={onShowReflections}
        />
      ))}
    </div>
  );
}
