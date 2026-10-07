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
  const deleteReminder = useDeleteReminder();
  const updateReminder = useUpdateReminder();

  return (
    <>
      <article
        className={cn(
          "surface-card group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-white/10"
        )}
      >
        {reminder.is_text ? (
          <div className="p-4 text-center">
            <p className="line-clamp-6 text-sm leading-relaxed text-foreground">
              {reminder.text}
            </p>
          </div>
        ) : reminder.img_url ? (
          <Image
            src={reminder.img_url}
            alt={reminder.caption ?? "Reminder image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground">No content</div>
        )}

        {!reminder.public && (
          <div className="absolute left-2 top-2 text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-label="Private reminder" />
          </div>
        )}

        <div className="surface-overlay absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="flex items-start justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
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
                    className="h-7 w-7 text-white hover:bg-white/20"
                    aria-label="Reminder actions"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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

          <div className="flex flex-col gap-1">
            {reminder.caption && (
              <p className="line-clamp-2 text-xs text-white/90">{reminder.caption}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 justify-start px-1 text-xs text-white hover:bg-white/20"
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
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">{reminder.caption ?? "Reminder"}</DialogTitle>
          {reminder.is_text ? (
            <div className="p-4">
              <p className="whitespace-pre-wrap text-base leading-relaxed">{reminder.text}</p>
              {reminder.caption && (
                <p className="mt-4 text-sm italic text-muted-foreground">{reminder.caption}</p>
              )}
            </div>
          ) : reminder.img_url ? (
            <div className="relative aspect-video w-full">
              <Image
                src={reminder.img_url}
                alt={reminder.caption ?? "Reminder"}
                fill
                className="object-contain"
                sizes="80vw"
              />
              {reminder.caption && (
                <p className="mt-4 text-sm italic text-muted-foreground">{reminder.caption}</p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
