"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyReminders } from "@/hooks/use-reminders";
import { AppShell } from "@/components/layout/app-shell";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import { AddReminderDialog } from "@/components/reminders/add-reminder-dialog";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import type { ReminderFull } from "@/schemas/reminder";

export function HomeWall() {
  const { data: user } = useCurrentUser();
  const { data: reminders = [], isLoading } = useMyReminders(user?.id);
  const [addOpen, setAddOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderFull | null>(null);

  return (
    <>
      <AppShell
        isOwnProfile
        onAddReminder={() => setAddOpen(true)}
        onEditProfile={() => setEditProfileOpen(true)}
        selectedReminder={selectedReminder}
        onCloseReflections={() => setSelectedReminder(null)}
      >
        <ReminderGrid
          reminders={reminders}
          isOwner
          isLoading={isLoading}
          onShowReflections={setSelectedReminder}
        />
      </AppShell>
      <AddReminderDialog open={addOpen} onOpenChange={setAddOpen} />
      {user && (
        <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} user={user} />
      )}
    </>
  );
}
