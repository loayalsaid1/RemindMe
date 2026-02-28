"use client";

import { useState, useEffect, useCallback } from "react";
import { getPublicReminders, type Reminder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ReminderGrid } from "@/components/reminders/reminder-grid";
import { ReflectionsPanel } from "@/components/reminders/reflections-panel";

export default function PublicPage() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filtered, setFiltered] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getPublicReminders();
      setReminders(data);
    } catch {
      toast({ title: "Failed to load public reminders", variant: "destructive" });
    }
  }, [toast]);

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

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))]">
      <Header onSearch={setSearch} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Public Reminders
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Explore reminders shared by the community
            </p>
          </div>
          <ReminderGrid
            reminders={filtered}
            isOwner={false}
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
    </div>
  );
}
