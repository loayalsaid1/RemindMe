"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Eye, EyeOff, Lock, MessageSquare, MoreVertical, Trash2, ZoomIn } from "lucide-react";
import type { ReminderFull } from "@/schemas/reminder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDeleteReminder, useUpdateReminder } from "@/hooks/use-reminders";
import { EditReminderDialog } from "@/components/reminders/edit-reminder-dialog";

interface ReminderCardProps {
  reminder: ReminderFull;
  isOwner?: boolean;
  onShowReflections?: (reminder: ReminderFull) => void;
}

export function ReminderCard({
  reminder,
  isOwner = false,
  onShowReflections,
}: ReminderCardProps) {
  const [zoomed, setZoomed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const deleteReminder = useDeleteReminder();
  const updateReminder = useUpdateReminder();

  return (
    <>
      <article
        onClick={() => setZoomed(true)}
        className={cn(
          "surface-card group relative cursor-pointer overflow-hidden rounded-lg border border-white/10 select-none",
          "aspect-[4/3]"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setZoomed(true);
          }
        }}
        aria-label={`Reminder: ${reminder.caption || reminder.text || "image"}. Tap to zoom.`}
      >
        {/* Card Content (Text or Image) */}
        {reminder.is_text ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <p className="line-clamp-6 text-sm leading-relaxed text-foreground">
              {reminder.text}
            </p>
          </div>
        ) : reminder.img_url ? (
          <>
            {/* Blurred background fill for letterboxed images */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={reminder.img_url}
                alt=""
                fill
                className="scale-110 object-cover blur-lg brightness-50"
                sizes="(max-width: 768px) 50vw, 33vw"
                aria-hidden
              />
            </div>
            {/* Actual image contained */}
            <div className="relative h-full w-full">
              <Image
                src={reminder.img_url}
                alt={reminder.caption ?? "Reminder image"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
            No content
          </div>
        )}

        {/* Private indicator pill — always visible if private */}
        {!reminder.public && (
          <div
            className="absolute left-2.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm"
            title="Private reminder"
          >
            <Lock className="h-3.5 w-3.5" aria-label="Private reminder" />
          </div>
        )}

        {/* Top-right actions (Always accessible on mobile, enhanced hover on desktop) */}
        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5">
          {/* Zoom button — subtle helper on desktop */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 rounded-full border border-white/10 bg-black/70 text-white shadow-md backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/90 hover:text-white focus-visible:text-white md:flex md:opacity-0 md:group-hover:opacity-100"
            aria-label="Zoom reminder"
            onClick={(event) => {
              event.stopPropagation();
              setZoomed(true);
            }}
          >
            <ZoomIn className="h-4 w-4 text-white" />
          </Button>

          {/* Owner 3-dot menu — always visible on mobile, hover on desktop */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full border border-white/10 bg-black/70 text-white shadow-md backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/90 hover:text-white focus-visible:text-white",
                    "opacity-90 md:opacity-0 md:group-hover:opacity-100"
                  )}
                  aria-label="Reminder options"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Reminder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    updateReminder.mutate({
                      id: reminder.id,
                      patch: { public: !reminder.public },
                      toastMessage: reminder.public ? "Set to private" : "Set to public",
                    });
                  }}
                >
                  {reminder.public ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" /> Make Private
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" /> Make Public
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteReminder.mutate(reminder.id);
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Bottom bar: caption + reflections */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/45 to-transparent p-2.5 pt-8">
          <div className="flex items-end justify-between gap-2">
            {/* Caption */}
            <div className="min-w-0 flex-1">
              {reminder.caption && (
                <p className="line-clamp-2 text-xs font-medium text-white/95 drop-shadow-sm">
                  {reminder.caption}
                </p>
              )}
            </div>

            {/* Reflections button — always accessible on mobile, enhanced hover on desktop */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "flex h-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/70 px-2.5 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/90 hover:text-white active:scale-95",
                "opacity-90 md:opacity-0 md:group-hover:opacity-100"
              )}
              onClick={(event) => {
                event.stopPropagation();
                onShowReflections?.(reminder);
              }}
              aria-label="Show reflections"
            >
              <MessageSquare className="h-3.5 w-3.5 text-white sm:mr-1" />
              <span className="hidden text-white sm:inline">Reflections</span>
            </Button>
          </div>
        </div>
      </article>

      {/* Zoom Dialog */}
      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="max-w-4xl border-white/10 bg-black/90 p-0 backdrop-blur-xl [&>button]:text-white">
          <DialogTitle className="sr-only">{reminder.caption ?? "Reminder"}</DialogTitle>
          {reminder.is_text ? (
            <div className="p-6 sm:p-8">
              <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-white">{reminder.text}</p>
              {reminder.caption && (
                <p className="mt-4 sm:mt-6 text-sm italic text-white/60">{reminder.caption}</p>
              )}
            </div>
          ) : reminder.img_url ? (
            <div className="flex flex-col">
              <div className="relative min-h-[50vh] sm:min-h-[60vh] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={reminder.img_url}
                  alt={reminder.caption ?? "Reminder"}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
              {reminder.caption && (
                <p className="rounded-b-lg bg-black/80 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm italic text-white/70">
                  {reminder.caption}
                </p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {isOwner && (
        <EditReminderDialog
          reminder={reminder}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}
