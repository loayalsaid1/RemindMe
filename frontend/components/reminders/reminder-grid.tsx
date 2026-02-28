"use client";

import { type Reminder } from "@/lib/api";
import { ReminderCard } from "./reminder-card";

interface ReminderGridProps {
  reminders: Reminder[];
  isOwner?: boolean;
  onDeleted?: (id: string) => void;
  onUpdated?: (reminder: Reminder) => void;
  onShowReflections?: (reminder: Reminder) => void;
}

export function ReminderGrid({
  reminders,
  isOwner = false,
  onDeleted,
  onUpdated,
  onShowReflections,
}: ReminderGridProps) {
  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[hsl(var(--muted-foreground))]">
        <p className="text-lg font-medium">No reminders yet</p>
        <p className="text-sm mt-1">Add your first reminder to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          isOwner={isOwner}
          onDeleted={onDeleted}
          onUpdated={onUpdated}
          onShowReflections={onShowReflections}
        />
      ))}
    </div>
  );
}
