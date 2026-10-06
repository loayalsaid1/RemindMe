"use client";

import { useMemo, useState } from "react";
import { usePublicReminders } from "@/hooks/use-reminders";
import { AppShell, PageHeading } from "@/components/layout/app-shell";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import type { ReminderFull } from "@/schemas/reminder";

export function PublicWall() {
  const { data: reminders = [], isLoading } = usePublicReminders();
  const [search, setSearch] = useState("");
  const [selectedReminder, setSelectedReminder] = useState<ReminderFull | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return reminders;
    const query = search.toLowerCase();
    return reminders.filter(
      (item) => item.text?.toLowerCase().includes(query) || item.caption?.toLowerCase().includes(query)
    );
  }, [reminders, search]);

  return (
    <AppShell
      onSearch={setSearch}
      selectedReminder={selectedReminder}
      onCloseReflections={() => setSelectedReminder(null)}
    >
      <PageHeading
        title="Public Reminders"
        description="Explore reminders shared by the community"
      />
      <ReminderGrid
        reminders={filtered}
        isOwner={false}
        isLoading={isLoading}
        onShowReflections={setSelectedReminder}
      />
    </AppShell>
  );
}
