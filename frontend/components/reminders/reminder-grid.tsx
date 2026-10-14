"use client";

import type { ReminderFull } from "@/schemas/reminder";
import { ReminderCard } from "@/components/reminders/reminder-card";

interface ReminderGridProps {
  reminders: ReminderFull[];
  isOwner?: boolean;
  onShowReflections?: (reminder: ReminderFull) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

// Minimum card width — cards auto-fill the available space.
// When the reflections panel is open the main column shrinks but cards
// won't go below this minimum, so they just stack fewer per row instead
// of being crushed into unusably thin columns.
const GRID_CLASS =
  "grid gap-3 p-4 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]";

export function ReminderGrid({
  reminders,
  isOwner = false,
  onShowReflections,
  isLoading = false,
  emptyMessage = "No reminders yet",
}: ReminderGridProps) {
  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="surface-card aspect-[4/3] animate-pulse rounded-lg border border-white/10"
          />
        ))}
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">{emptyMessage}</p>
        {emptyMessage === "No reminders yet" && (
          <p className="mt-1 text-sm">Add your first reminder to get started</p>
        )}
      </div>
    );
  }

  return (
    <div className={GRID_CLASS}>
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
