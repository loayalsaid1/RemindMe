"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Eye, EyeOff, Lock, MessageSquare, Trash2, ZoomIn } from "lucide-react";
import { type Reminder, deleteReminder, updateReminder } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ReminderCardProps {
  reminder: Reminder;
  isOwner?: boolean;
  onDeleted?: (id: string) => void;
  onUpdated?: (reminder: Reminder) => void;
  onShowReflections?: (reminder: Reminder) => void;
}

export function ReminderCard({
  reminder,
  isOwner = false,
  onDeleted,
  onUpdated,
  onShowReflections,
}: ReminderCardProps) {
  const [hovered, setHovered] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteReminder(reminder.id);
      toast({ title: "Reminder deleted" });
      onDeleted?.(reminder.id);
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const updated = await updateReminder(reminder.id, { public: !reminder.public });
      toast({ title: updated.public ? "Set to public" : "Set to private" });
      onUpdated?.(updated);
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] cursor-pointer group",
          "aspect-square flex items-center justify-center"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Content */}
        {reminder.is_text ? (
          <div className="p-4 text-center">
            <p className="text-sm leading-relaxed text-[hsl(var(--foreground))] line-clamp-6">
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
          <div className="p-4 text-center text-[hsl(var(--muted-foreground))] text-xs">
            No content
          </div>
        )}

        {/* Private badge */}
        {!reminder.public && (
          <div className="absolute top-2 left-2 text-[hsl(var(--muted-foreground))]">
            <Lock className="h-3.5 w-3.5" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 flex flex-col justify-between p-3 transition-opacity duration-200",
            hovered ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Top row: menu */}
          <div className="flex justify-end items-start gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); setZoomed(true); }}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleToggleVisibility}>
                    {reminder.public ? (
                      <><EyeOff className="mr-2 h-4 w-4" /> Make Private</>
                    ) : (
                      <><Eye className="mr-2 h-4 w-4" /> Make Public</>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-[hsl(var(--destructive))]"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Bottom row: caption + reflections */}
          <div className="flex flex-col gap-1">
            {reminder.caption && (
              <p className="text-xs text-white/90 line-clamp-2">{reminder.caption}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-white hover:bg-white/20 justify-start px-1 text-xs"
              onClick={(e) => { e.stopPropagation(); onShowReflections?.(reminder); }}
            >
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
              Show Reflections
            </Button>
          </div>
        </div>
      </div>

      {/* Zoom dialog */}
      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">
            {reminder.caption ?? "Reminder"}
          </DialogTitle>
          {reminder.is_text ? (
            <div className="p-4">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{reminder.text}</p>
              {reminder.caption && (
                <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))] italic">
                  {reminder.caption}
                </p>
              )}
            </div>
          ) : reminder.img_url ? (
            <div className="relative w-full aspect-video">
              <Image
                src={reminder.img_url}
                alt={reminder.caption ?? "Reminder"}
                fill
                className="object-contain"
                sizes="80vw"
              />
              {reminder.caption && (
                <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))] italic">
                  {reminder.caption}
                </p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
