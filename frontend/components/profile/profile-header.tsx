"use client";

import { useState } from "react";
import { Flame, LogOut, Pencil, Zap } from "lucide-react";
import type { UserFull } from "@/schemas/user";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";

interface ProfileHeaderProps {
  profileUser: UserFull | null | undefined;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  profileUser,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const { data: authUser } = useCurrentUser();
  const logout = useLogout();
  const [editOpen, setEditOpen] = useState(false);

  const displayUser = profileUser ?? (isOwnProfile ? authUser : null);

  if (!displayUser) return null;

  const initials = `${displayUser.first_name[0] ?? ""}${displayUser.last_name[0] ?? ""}`.toUpperCase() || "?";
  const currentStreak = displayUser.current_streak?.days ?? 0;
  const longestStreak = displayUser.longest_streak?.days ?? 0;

  return (
    <>
      <section
        className="surface-card relative mx-4 mb-4 mt-3 flex flex-col items-center rounded-xl border border-white/10 p-5 text-center shadow-lg md:hidden"
        aria-label="User Profile Details"
      >
        {/* Avatar */}
        <Avatar className="h-20 w-20 border-2 border-primary/40 shadow-md">
          <AvatarImage src={displayUser.img_url ?? ""} alt={displayUser.first_name} />
          <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
        </Avatar>

        {/* User Identity */}
        <div className="mt-3">
          <h2 className="text-base font-bold text-foreground">
            {displayUser.first_name} {displayUser.last_name}
          </h2>
          <p className="text-xs text-muted-foreground">@{displayUser.user_name}</p>
          {displayUser.description && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {displayUser.description}
            </p>
          )}
        </div>

        {/* Streaks stats */}
        <div className="mt-4 flex w-full max-w-xs items-center justify-around rounded-lg border border-white/5 bg-white/[0.03] py-2.5">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-primary streak-glow">
              <Flame className="h-5 w-5" />
              <span className="text-lg font-bold">{currentStreak}</span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">Current streak</span>
          </div>

          <div className="h-8 w-px bg-white/10" aria-hidden="true" />

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-orange-400 streak-glow-orange">
              <Zap className="h-5 w-5" />
              <span className="text-lg font-bold">{longestStreak}</span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">Best streak</span>
          </div>
        </div>

        {/* Action buttons (Own profile only) */}
        {isOwnProfile && authUser && (
          <div className="mt-4 flex w-full max-w-xs gap-2">
            <Button
              size="sm"
              className="surface-cta flex-1 border-0 text-xs font-semibold"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => logout.mutate()}
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </section>

      {/* Edit Profile Dialog */}
      {isOwnProfile && authUser && (
        <EditProfileDialog
          user={authUser}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}

