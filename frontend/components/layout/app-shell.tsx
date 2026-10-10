"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { UserFull } from "@/schemas/user";
import type { ReminderFull } from "@/schemas/reminder";
import { ReflectionsPanel } from "@/components/reminders/reflections-panel";

interface AppShellProps {
  children: React.ReactNode;
  profileUser?: UserFull | null;
  isOwnProfile?: boolean;
  onAddReminder?: () => void;
  onEditProfile?: () => void;
  selectedReminder?: ReminderFull | null;
  onCloseReflections?: () => void;
}

export function AppShell({
  children,
  profileUser,
  isOwnProfile,
  onAddReminder,
  onEditProfile,
  selectedReminder,
  onCloseReflections,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative z-10 flex h-dvh flex-col">
      <Header onMenuClick={() => setMobileOpen(true)} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          onAddReminder={onAddReminder}
          onEditProfile={onEditProfile}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />
        <main className={cn("surface-enter-main min-w-0 flex-1 overflow-y-auto", selectedReminder && "pb-[70dvh] md:pb-0")}>
          {children}
        </main>
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
