"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { getUserByUsername, getUserReminders, getPublicReminders, type User, type Reminder } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import { ReflectionsPanel } from "@/components/reminders/reflections-panel";
import { AddReminderDialog } from "@/components/reminders/add-reminder-dialog";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const isOwn = authUser?.user_name === username;

  const loadUser = useCallback(async () => {
    try {
      const found = await getUserByUsername(username);
      if (!found) {
        setNotFound(true);
        return;
      }
      setProfileUser(found);
    } catch {
      setNotFound(true);
    }
  }, [username]);

  const loadReminders = useCallback(async () => {
    if (!profileUser) return;
    try {
      if (isOwn) {
        // Fetch all reminders (public + private) for own profile
        const data = await getUserReminders(profileUser.id);
        setReminders(data);
      } else {
        // For other users, show only their public reminders filtered from the public feed
        const all = await getPublicReminders();
        setReminders(all.filter((r) => r.user_id === profileUser.id));
      }
    } catch {
      toast({ title: "Failed to load reminders", variant: "destructive" });
    }
  }, [profileUser, isOwn, toast]);

  useEffect(() => {
    if (isOwn && authUser) {
      setProfileUser(authUser);
    } else {
      loadUser();
    }
  }, [isOwn, authUser, loadUser]);

  useEffect(() => {
    if (profileUser) loadReminders();
  }, [profileUser, loadReminders]);

  const handleDeleted = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (selectedReminder?.id === id) setSelectedReminder(null);
  };

  const handleUpdated = (updated: Reminder) => {
    setReminders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleCreated = (reminder: Reminder) => {
    setReminders((prev) => [reminder, ...prev]);
  };

  if (notFound) {
    return (
      <div className="flex flex-col h-screen bg-[hsl(var(--background))]">
        <Header />
        <div className="flex flex-1 items-center justify-center text-[hsl(var(--muted-foreground))]">
          User &quot;{username}&quot; not found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          profileUser={profileUser}
          isOwnProfile={isOwn}
          onAddReminder={() => setAddOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {!isOwn && profileUser && (
            <div className="px-4 pt-4 pb-2">
              <h1 className="text-lg font-semibold">
                {profileUser.first_name}&apos;s Reminders
              </h1>
            </div>
          )}
          <ReminderGrid
            reminders={reminders}
            isOwner={isOwn}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
            onShowReflections={setSelectedReminder}
          />
        </main>
        {selectedReminder && (
          <ReflectionsPanel
            reminder={selectedReminder}
            onClose={() => setSelectedReminder(null)}
          />
        )}
      </div>
      {isOwn && (
        <AddReminderDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
