"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useUserByUsername } from "@/hooks/use-user-profile";
import { useUserReminders } from "@/hooks/use-reminders";
import { AppShell, PageHeading } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import { AddReminderDialog } from "@/components/reminders/add-reminder-dialog";
import { ApiError } from "@/lib/api-error";
import type { ReminderFull } from "@/schemas/reminder";

export function UserWall({ username }: { username: string }) {
  const { data: authUser } = useCurrentUser();
  const isOwn = authUser?.user_name === username;
  const profileQuery = useUserByUsername(username, !isOwn);
  const profileUser = isOwn ? authUser : profileQuery.data;
  const { data: reminders = [], isLoading } = useUserReminders(profileUser?.id, isOwn);
  const [selectedReminder, setSelectedReminder] = useState<ReminderFull | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const notFound = !isOwn && profileQuery.isError && profileQuery.error instanceof ApiError
    ? profileQuery.error.status === 404
    : !isOwn && !profileQuery.isLoading && !profileUser;

  if (notFound) {
    return (
      <div className="flex h-dvh flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          User &quot;{username}&quot; not found.
        </div>
      </div>
    );
  }

  return (
    <>
      <AppShell
        profileUser={profileUser}
        isOwnProfile={isOwn}
        onAddReminder={() => setAddOpen(true)}
        selectedReminder={selectedReminder}
        onCloseReflections={() => setSelectedReminder(null)}
      >
        {!isOwn && profileUser && (
          <PageHeading title={`${profileUser.first_name}'s Reminders`} />
        )}
        <ReminderGrid
          reminders={reminders}
          isOwner={isOwn}
          isLoading={isLoading || profileQuery.isLoading}
          onShowReflections={setSelectedReminder}
        />
      </AppShell>
      {isOwn && <AddReminderDialog open={addOpen} onOpenChange={setAddOpen} />}
    </>
  );
}
