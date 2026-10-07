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
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="surface-card aspect-square animate-pulse rounded-lg border border-white/10"
          />
        ))}
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No reminders yet</p>
        <p className="mt-1 text-sm">Add your first reminder to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
