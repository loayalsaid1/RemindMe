"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Flame, Globe, Home, Pencil, Plus, X, Zap } from "lucide-react";
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
  onEditProfile?: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function Sidebar({
  profileUser,
  isOwnProfile = false,
  onAddReminder,
  onEditProfile,
  collapsed,
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
}: SidebarProps) {
  const { data: authUser } = useCurrentUser();
  const pathname = usePathname();
  const displayUser = profileUser ?? authUser;

  const initials = displayUser
    ? `${displayUser.first_name[0] ?? ""}${displayUser.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  const currentDays = displayUser?.current_streak?.days ?? 0;
  const longestDays = displayUser?.longest_streak?.days ?? 0;

  function closeMobile() {
    onMobileOpenChange?.(false);
  }

  const nav = (
    <>
      <div className="relative z-10 flex items-center justify-between p-2">
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 md:inline-flex"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 md:hidden"
          onClick={closeMobile}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {displayUser && (
        <div className={cn("relative z-10 flex flex-col items-center gap-2 px-3 pb-4", collapsed && "px-1")}>
          <Avatar className={cn("h-14 w-14 border-2 border-brand/30", collapsed && "h-9 w-9")}>
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
            </>
          )}
          <div className={cn("mt-1 flex gap-3", collapsed && "flex-col gap-2")}>
            <div className="flex flex-col items-center" title="Current streak">
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-brand" />
                <span className="surface-streak text-sm font-bold">{currentDays}</span>
              </div>
              {!collapsed && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Current</span>}
            </div>
            <div className="flex flex-col items-center" title="Longest streak">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-brand" />
                <span className="surface-streak text-sm font-bold">{longestDays}</span>
              </div>
              {!collapsed && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Longest</span>}
            </div>
          </div>
          {isOwnProfile && onEditProfile && !collapsed && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="surface-shine mt-2 w-full"
              onClick={onEditProfile}
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          )}
        </div>
      )}

      <Separator className="relative z-10" />

      <nav className="relative z-10 mt-2 flex flex-col gap-1 p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-11 justify-start md:h-8", pathname === "/" && "bg-accent/20 font-semibold")}
          asChild
        >
          <Link href="/" onClick={closeMobile}>
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Your reminders</span>}
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-11 justify-start md:h-8", pathname === "/public" && "bg-accent/20 font-semibold")}
          asChild
        >
          <Link href="/public" onClick={closeMobile}>
            <Globe className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Public reminders</span>}
          </Link>
        </Button>
      </nav>

      <Separator className="relative z-10" />

      {isOwnProfile && (
        <div className="relative z-10 mt-auto p-2">
          <Button
            size="sm"
            className={cn("surface-cta surface-shine h-11 w-full border-0 md:h-9", collapsed && "justify-center p-0")}
            onClick={() => {
              onAddReminder?.();
              closeMobile();
            }}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-1">Add reminder</span>}
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          aria-label="Close menu overlay"
          onClick={closeMobile}
        />
      )}
      <aside
        className={cn(
          "surface-sidebar surface-enter-sidebar relative z-50 hidden h-full flex-col border-r border-white/10 transition-all duration-200 md:flex",
          collapsed ? "w-14" : "w-64"
        )}
      >
        <div className="surface-sidebar-glow pointer-events-none absolute inset-0" />
        {nav}
      </aside>
      <aside
        className={cn(
          "surface-sidebar fixed inset-y-0 left-0 z-50 flex w-[75vw] max-w-xs flex-col border-r border-white/10 transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="surface-sidebar-glow pointer-events-none absolute inset-0" />
        {nav}
      </aside>
    </>
  );
}
