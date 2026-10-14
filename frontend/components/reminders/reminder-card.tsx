"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Eye, EyeOff, Lock, MessageSquare, Trash2, ZoomIn } from "lucide-react";
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
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const deleteReminder = useDeleteReminder();
  const updateReminder = useUpdateReminder();

  return (
    <>
      <article
        className={cn(
          "surface-card group relative cursor-pointer overflow-hidden rounded-lg border border-white/10",
          reminder.is_text ? "aspect-[4/3]" : "aspect-[4/3]"
        )}
      >
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
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">No content</div>
        )}

        {!reminder.public && (
          <div className="absolute left-2 top-2 rounded-full bg-black/60 p-0.5 text-white drop-shadow">
            <Lock className="h-3.5 w-3.5" aria-label="Private reminder" />
          </div>
        )}

        {/* Overlay: stronger gradient so icons always visible */}
        <div className="surface-overlay absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          {/* Top-row action buttons */}
          <div className="flex items-start justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-black/60 text-white shadow-md hover:bg-black/80"
              aria-label="Zoom reminder"
              onClick={(event) => {
                event.stopPropagation();
                setZoomed(true);
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-black/60 text-white shadow-md hover:bg-black/80"
                    aria-label="Reminder actions"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setEditOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Reminder
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateReminder.mutate({
                        id: reminder.id,
                        patch: { public: !reminder.public },
                        toastMessage: reminder.public ? "Set to private" : "Set to public",
                      })
                    }
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
                    onClick={() => deleteReminder.mutate(reminder.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Bottom caption + reflections */}
          <div className="flex flex-col gap-1">
            {reminder.caption && (
              <button
                type="button"
                className="text-left"
                onClick={(event) => {
                  event.stopPropagation();
                  setCaptionExpanded((v) => !v);
                }}
              >
                <p
                  className={cn(
                    "text-xs text-white/90 transition-all",
                    captionExpanded ? "" : "line-clamp-2"
                  )}
                >
                  {reminder.caption}
                </p>
                {!captionExpanded && reminder.caption.length > 60 && (
                  <span className="text-xs text-white/50">…tap to expand</span>
                )}
              </button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 justify-start px-1 text-xs font-medium text-white shadow-sm hover:bg-white/25"
              onClick={(event) => {
                event.stopPropagation();
                onShowReflections?.(reminder);
              }}
            >
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
              Show Reflections
            </Button>
          </div>
        </div>
      </article>

      {/* Zoom dialog — large, with backdrop blur */}
      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="max-w-4xl border-white/10 bg-black/90 p-0 backdrop-blur-xl [&>button]:text-white">
          <DialogTitle className="sr-only">{reminder.caption ?? "Reminder"}</DialogTitle>
          {reminder.is_text ? (
            <div className="p-8">
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-white">{reminder.text}</p>
              {reminder.caption && (
                <p className="mt-6 text-sm italic text-white/60">{reminder.caption}</p>
              )}
            </div>
          ) : reminder.img_url ? (
            <div className="flex flex-col">
              {/* Image fills to its natural size, contained */}
              <div className="relative min-h-[60vh] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={reminder.img_url}
                  alt={reminder.caption ?? "Reminder"}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
              {reminder.caption && (
                <p className="rounded-b-lg bg-black/80 px-6 py-3 text-sm italic text-white/70">
                  {reminder.caption}
                </p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
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
