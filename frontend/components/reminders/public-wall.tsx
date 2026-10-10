"use client";

import { useState } from "react";
import { usePublicReminders } from "@/hooks/use-reminders";
import { AppShell, PageHeading } from "@/components/layout/app-shell";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import type { ReminderFull } from "@/schemas/reminder";

export function PublicWall() {
  const { data: reminders = [], isLoading } = usePublicReminders();
  const [selectedReminder, setSelectedReminder] = useState<ReminderFull | null>(null);

  return (
    <AppShell
      selectedReminder={selectedReminder}
      onCloseReflections={() => setSelectedReminder(null)}
    >
      <PageHeading
        title="Public Reminders"
        description="Explore reminders shared by the community"
      />
      <ReminderGrid
        reminders={reminders}
        isOwner={false}
        isLoading={isLoading}
        onShowReflections={setSelectedReminder}
      />
    </AppShell>
  );
}
