"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserReminders, type Reminder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import { AddReminderDialog } from "@/components/reminders/add-reminder-dialog";
import { ReflectionsPanel } from "@/components/reminders/reflections-panel";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filtered, setFiltered] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserReminders(user.id);
      setReminders(data);
    } catch {
      toast({ title: "Failed to load reminders", variant: "destructive" });
    }
  }, [user, toast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(reminders);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        reminders.filter(
          (r) =>
            r.text?.toLowerCase().includes(q) ||
            r.caption?.toLowerCase().includes(q)
        )
      );
    }
  }, [reminders, search]);

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

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))]">
      <Header onSearch={setSearch} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOwnProfile
          onAddReminder={() => setAddOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <ReminderGrid
            reminders={filtered}
            isOwner
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
      <AddReminderDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}
