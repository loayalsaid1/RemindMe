"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Flame, Globe, Home, Plus, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { type User } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  profileUser?: User | null;
  isOwnProfile?: boolean;
  onAddReminder?: () => void;
  onEditProfile?: () => void;
}

export function Sidebar({
  profileUser,
  isOwnProfile = false,
  onAddReminder,
  onEditProfile,
}: SidebarProps) {
  const { user: authUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const displayUser = profileUser ?? authUser;

  const initials = displayUser
    ? `${displayUser.first_name[0]}${displayUser.last_name[0]}`.toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all duration-200",
        collapsed ? "w-14" : "w-64"
      )}
    >
      {/* Toggle */}
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User info */}
      {displayUser && (
        <div className={cn("flex flex-col items-center gap-2 px-3 pb-4", collapsed && "px-2")}>
          <Avatar className={cn("h-14 w-14", collapsed && "h-9 w-9")}>
            <AvatarImage src={displayUser.img_url ?? ""} alt={displayUser.first_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="text-center">
                <p className="font-semibold text-sm">
                  {displayUser.first_name} {displayUser.last_name}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">@{displayUser.user_name}</p>
              </div>
              {displayUser.description && (
                <p className="text-xs text-center text-[hsl(var(--muted-foreground))] px-2">
                  {displayUser.description}
                </p>
              )}
              {/* Streaks */}
              <div className="flex gap-3 mt-1">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[hsl(var(--primary))]">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">{displayUser.current_streak?.days ?? 0}</span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">Current</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-bold">{displayUser.longest_streak?.days ?? 0}</span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">Longest</span>
                </div>
              </div>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1"
                  onClick={onEditProfile}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </div>
      )}

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2 mt-2">
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

      <Separator />

      {/* Add Reminder */}
      {isOwnProfile && (
        <div className="p-2 mt-2">
          <Button
            size="sm"
            className={cn("w-full", collapsed && "p-0 justify-center")}
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
