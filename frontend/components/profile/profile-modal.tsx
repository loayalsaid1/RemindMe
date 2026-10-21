"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, LayoutGrid, Pencil, Zap } from "lucide-react";
import type { UserFull } from "@/schemas/user";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";

interface ProfileModalProps {
  user: UserFull | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ user, open, onOpenChange }: ProfileModalProps) {
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase() || "?";
  const currentStreak = user.current_streak?.days ?? 0;
  const longestStreak = user.longest_streak?.days ?? 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm border-white/10 surface-panel p-6 shadow-2xl">
          <DialogTitle className="sr-only">My Profile</DialogTitle>

          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <Avatar className="h-20 w-20 border-2 border-primary/40 shadow-lg">
              <AvatarImage src={user.img_url ?? ""} alt={user.first_name} />
              <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
            </Avatar>

            {/* User details */}
            <div className="mt-3">
              <h2 className="text-lg font-bold text-foreground">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-xs text-muted-foreground">@{user.user_name}</p>
              {user.description && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground px-2">
                  {user.description}
                </p>
              )}
            </div>

            {/* Streaks row */}
            <div className="mt-4 flex w-full items-center justify-around rounded-lg border border-white/5 bg-white/[0.03] py-2.5">
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

            {/* Action buttons */}
            <div className="mt-5 flex w-full flex-col gap-2">
              <Button
                size="sm"
                className="surface-cta w-full border-0 text-xs font-semibold"
                onClick={() => {
                  onOpenChange(false);
                  setEditOpen(true);
                }}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit Profile
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="w-full border-white/10 text-xs hover:bg-white/5"
                asChild
              >
                <Link
                  href={`/user/${user.user_name}`}
                  onClick={() => onOpenChange(false)}
                >
                  <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                  View Reminder Wall
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

