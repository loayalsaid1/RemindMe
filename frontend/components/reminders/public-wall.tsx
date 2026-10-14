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
      (item) =>
        item.text?.toLowerCase().includes(query) ||
        item.caption?.toLowerCase().includes(query) ||
        // username search — the field comes from the serializer as passthrough
        (item as Record<string, unknown>)["username"]?.toString().toLowerCase().includes(query) ||
        (item as Record<string, unknown>)["user_name"]?.toString().toLowerCase().includes(query)
    );
  }, [reminders, search]);

  return (
    <AppShell
      onSearch={setSearch}
      searchPlaceholder="Search by username or text…"
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
        emptyMessage="No public reminders found"
      />
    </AppShell>
  );
}
