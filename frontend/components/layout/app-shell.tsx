"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { UserFull } from "@/schemas/user";
import type { ReminderFull } from "@/schemas/reminder";
import { ReflectionsPanel } from "@/components/reminders/reflections-panel";

interface AppShellProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  profileUser?: UserFull | null;
  isOwnProfile?: boolean;
  onAddReminder?: () => void;
  selectedReminder?: ReminderFull | null;
  onCloseReflections?: () => void;
}

export function AppShell({
  children,
  onSearch,
  profileUser,
  isOwnProfile,
  onAddReminder,
  selectedReminder,
  onCloseReflections,
}: AppShellProps) {
  return (
    <div className="relative z-10 flex h-dvh flex-col">
      <Header onSearch={onSearch} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          onAddReminder={onAddReminder}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
        {selectedReminder && onCloseReflections && (
          <ReflectionsPanel reminder={selectedReminder} onClose={onCloseReflections} />
        )}
      </div>
    </div>
  );
}

export function PageHeading({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("px-4 pb-2 pt-4", className)}>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
