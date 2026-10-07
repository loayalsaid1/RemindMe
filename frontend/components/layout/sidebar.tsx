"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Globe, Home, Plus, Zap } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import type { UserFull } from "@/schemas/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  profileUser?: UserFull | null;
  isOwnProfile?: boolean;
  onAddReminder?: () => void;
}

export function Sidebar({
  profileUser,
  isOwnProfile = false,
  onAddReminder,
}: SidebarProps) {
  const { data: authUser } = useCurrentUser();
  const [collapsed, setCollapsed] = useState(false);
  const displayUser = profileUser ?? authUser;

  const initials = displayUser
    ? `${displayUser.first_name[0] ?? ""}${displayUser.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "surface-sidebar relative hidden flex-col border-r border-white/10 transition-all duration-200 md:flex",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className="surface-sidebar-glow pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {displayUser && (
        <div className={cn("relative z-10 flex flex-col items-center gap-2 px-3 pb-4", collapsed && "px-2")}>
          <Avatar className={cn("h-14 w-14", collapsed && "h-9 w-9")}>
            <AvatarImage src={displayUser.img_url ?? ""} alt={displayUser.first_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {displayUser.first_name} {displayUser.last_name}
                </p>
                <p className="text-xs text-muted-foreground">@{displayUser.user_name}</p>
              </div>
              {displayUser.description && (
                <p className="px-2 text-center text-xs text-muted-foreground">{displayUser.description}</p>
              )}
              <div className="mt-1 flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-primary">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">{displayUser.current_streak?.days ?? 0}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Current</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-bold">{displayUser.longest_streak?.days ?? 0}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Longest</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <Separator className="relative z-10" />

      <nav className="relative z-10 mt-2 flex flex-col gap-1 p-2">
        <Button variant="ghost" size="sm" className="justify-start" asChild>
          <Link href="/">
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">My Reminders</span>}
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="justify-start" asChild>
          <Link href="/public">
            <Globe className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Public</span>}
          </Link>
        </Button>
      </nav>

      <Separator className="relative z-10" />

      {isOwnProfile && (
        <div className="relative z-10 mt-2 p-2">
          <Button
            size="sm"
            className={cn("surface-cta w-full border-0", collapsed && "justify-center p-0")}
            onClick={onAddReminder}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-1">Add Reminder</span>}
          </Button>
        </div>
      )}
    </aside>
  );
}
