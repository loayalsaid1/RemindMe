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
import { EditReminderDialog } from "@/components/reminders/edit-reminder-dialog";
import { useDeleteReminder, useUpdateReminder } from "@/hooks/use-reminders";

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
  const [editing, setEditing] = useState(false);
  const [captionOpen, setCaptionOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const deleteReminder = useDeleteReminder();
  const updateReminder = useUpdateReminder();
  const longCaption = Boolean(reminder.caption && reminder.caption.length > 70);

  return (
    <>
      <article
        className={cn(
          "surface-card surface-enter-stagger group relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10"
        )}
        onClick={() => setMobileOpen((value) => !value)}
      >
        <div className="surface-media absolute inset-0 flex items-center justify-center overflow-hidden">
          {reminder.is_text ? (
            <p className="line-clamp-6 px-4 text-center text-sm font-bold leading-relaxed tracking-wide text-transparent [background-image:linear-gradient(to_bottom,#fff,#e0e0e0)] bg-clip-text group-hover:text-white group-hover:[background-image:none] sm:text-base">
              {reminder.text}
            </p>
          ) : reminder.img_url ? (
            <Image
              src={reminder.img_url}
              alt={reminder.caption ?? "Reminder image"}
              fill
              className="object-contain p-1"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">No content</div>
          )}
        </div>

        {!reminder.public && (
          <div className="surface-icon absolute left-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full">
            <Lock className="h-4 w-4" aria-label="Private reminder" />
          </div>
        )}

        <div
          className={cn(
            "surface-overlay pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 opacity-0 transition-opacity",
            "md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100",
            mobileOpen && "pointer-events-auto opacity-100"
          )}
        >
          <div className="flex items-start justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="surface-icon h-11 w-11 rounded-full hover:bg-transparent md:h-9 md:w-9"
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
                    className="surface-icon h-11 w-11 rounded-full hover:bg-transparent md:h-9 md:w-9"
                    aria-label="Reminder actions"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateReminder.mutate({
                        id: reminder.id,
                        patch: { public: !reminder.public },
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
                    onClick={() => {
                      if (window.confirm("You are deleting one of your reminders now!")) {
                        deleteReminder.mutate(reminder.id);
                      }
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            {reminder.caption && (
              <button
                type="button"
                className="max-h-[40%] max-w-[90%] overflow-auto rounded-lg bg-white/5 px-3 py-2 text-center text-xs font-semibold tracking-wide text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  if (longCaption) setCaptionOpen((value) => !value);
                }}
              >
                {captionOpen || !longCaption ? reminder.caption : `${reminder.caption.slice(0, 70)}...`}
                {longCaption && (
                  <span className="mt-1 block text-[10px] font-normal text-brand">
                    {captionOpen ? "Show less" : "Show more"}
                  </span>
                )}
              </button>
            )}
            <Button
              size="sm"
              className="surface-cta surface-shine h-11 border-0 px-4 text-xs md:h-8"
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

      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="surface-magnify max-h-[92dvh] w-[min(96vw,72rem)] max-w-none overflow-y-auto border-white/10 p-3 sm:p-6">
          <DialogTitle className="sr-only">{reminder.caption ?? "Reminder"}</DialogTitle>
          {reminder.is_text ? (
            <div className="max-h-[80dvh] overflow-auto p-4 sm:p-8">
              <p className="whitespace-pre-wrap text-base leading-relaxed sm:text-xl">{reminder.text}</p>
              {reminder.caption && (
                <p className="mt-4 text-sm italic text-muted-foreground">{reminder.caption}</p>
              )}
            </div>
          ) : reminder.img_url ? (
            <div className="flex flex-col gap-3">
              <div className="relative mx-auto max-h-[78dvh] w-full min-h-[50vh]">
                <Image
                  src={reminder.img_url}
                  alt={reminder.caption ?? "Reminder"}
                  fill
                  className="object-contain"
                  sizes="96vw"
                />
              </div>
              {reminder.caption && (
                <p className="text-sm italic text-muted-foreground">{reminder.caption}</p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {isOwner && (
        <EditReminderDialog open={editing} onOpenChange={setEditing} reminder={reminder} />
      )}
    </>
  );
}
