"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Flame, Globe, Home, Pencil, Plus, User, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";

interface MobileNavProps {
  isOwnProfile?: boolean;
  onAddReminder?: () => void;
}

export function MobileNav({ isOwnProfile, onAddReminder }: MobileNavProps) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  const currentStreak = user?.current_streak?.days ?? 0;
  const longestStreak = user?.longest_streak?.days ?? 0;

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex items-center border-t border-white/10 md:hidden"
        style={{ background: "linear-gradient(to top, var(--ink-900), var(--ink-800))" }}
      >
        <Link
          href="/"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
            pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="My Reminders"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {isOwnProfile && (
          <button
            type="button"
            onClick={onAddReminder}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Add Reminder"
          >
            <div className="surface-cta flex h-10 w-10 items-center justify-center rounded-full border-0 shadow-lg">
              <Plus className="h-5 w-5" />
            </div>
            <span>Add</span>
          </button>
        )}

        <Link
          href="/public"
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
            pathname === "/public" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Public Reminders"
        >
          <Globe className="h-5 w-5" />
          <span>Public</span>
        </Link>

        {/* Profile tab */}
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Profile"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            {user?.img_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.img_url} alt={user.first_name} className="h-full w-full rounded-full object-cover" />
            )}
          </Avatar>
          <span>Profile</span>
        </button>
      </nav>

      {/* Profile slide-up panel */}
      {profileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
            onClick={() => setProfileOpen(false)}
          />
          {/* Sheet */}
          <div className="animate-slide-up fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border-t border-white/10 pb-safe md:hidden"
            style={{ background: "linear-gradient(to bottom, var(--ink-800), var(--ink-900))" }}
          >
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-4 pb-2 pt-3">
              <div className="mx-auto h-1 w-10 rounded-full bg-white/20" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 h-7 w-7"
                onClick={() => setProfileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile info */}
            {user && (
              <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-2">
                <Avatar className="h-16 w-16 border-2 border-primary/30">
                  <AvatarImage src={user.img_url ?? ""} alt={user.first_name} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <p className="text-base font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">@{user.user_name}</p>
                  {user.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{user.description}</p>
                  )}
                </div>

                {/* Streaks */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1 text-primary streak-glow">
                      <Flame className="h-5 w-5" />
                      <span className="text-lg font-bold">{currentStreak}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Current streak</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1 text-orange-400 streak-glow-orange">
                      <Zap className="h-5 w-5" />
                      <span className="text-lg font-bold">{longestStreak}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Longest streak</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full flex-col gap-2 pt-1">
                  <Link
                    href={`/user/${user.user_name}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    View My Profile
                  </Link>

                  {isOwnProfile && (
                    <Button
                      className="surface-cta w-full border-0"
                      onClick={() => {
                        setProfileOpen(false);
                        setEditProfileOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Safe-area spacer */}
            <div className="h-safe-bottom" />
          </div>
        </>
      )}

      {/* Edit profile dialog (triggered from the profile sheet) */}
      {user && (
        <EditProfileDialog
          user={user}
          open={editProfileOpen}
          onOpenChange={setEditProfileOpen}
        />
      )}
    </>
  );
}
