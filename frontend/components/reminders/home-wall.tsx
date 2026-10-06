"use client";

import { useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyReminders } from "@/hooks/use-reminders";
import { AppShell } from "@/components/layout/app-shell";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import { AddReminderDialog } from "@/components/reminders/add-reminder-dialog";
import type { ReminderFull } from "@/schemas/reminder";

export function HomeWall() {
  const { data: user } = useCurrentUser();
  const { data: reminders = [], isLoading } = useMyReminders(user?.id);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderFull | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return reminders;
    const query = search.toLowerCase();
    return reminders.filter(
      (item) => item.text?.toLowerCase().includes(query) || item.caption?.toLowerCase().includes(query)
    );
  }, [reminders, search]);

  return (
    <>
      <AppShell
        onSearch={setSearch}
        isOwnProfile
        onAddReminder={() => setAddOpen(true)}
        selectedReminder={selectedReminder}
        onCloseReflections={() => setSelectedReminder(null)}
      >
        <ReminderGrid
          reminders={filtered}
          isOwner
          isLoading={isLoading}
          onShowReflections={setSelectedReminder}
        />
      </AppShell>
      <AddReminderDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
