"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2, X } from "lucide-react";
import {
  getReflections,
  createReflection,
  deleteReflection,
  type Reflection,
  type Reminder,
} from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ReflectionsPanelProps {
  reminder: Reminder | null;
  onClose: () => void;
}

export function ReflectionsPanel({ reminder, onClose }: ReflectionsPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const load = useCallback(async () => {
    if (!reminder) return;
    setIsLoading(true);
    try {
      const data = await getReflections(reminder.id);
      setReflections(data);
    } catch {
      toast({ title: "Failed to load reflections", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [reminder, toast]);

  useEffect(() => {
    if (reminder) load();
    else setReflections([]);
  }, [reminder, load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminder || !newContent.trim()) return;
    setIsSending(true);
    try {
      const reflection = await createReflection(reminder.id, newContent.trim());
      setReflections((prev) => [...prev, reflection]);
      setNewContent("");
    } catch {
      toast({ title: "Failed to add reflection", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReflection(id);
      setReflections((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast({ title: "Failed to delete reflection", variant: "destructive" });
    }
  };

  if (!reminder) return null;

  return (
    <div className="flex flex-col w-80 border-l border-[hsl(var(--border))] bg-[hsl(var(--card))] h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
        <h3 className="font-semibold text-sm">Reflections</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Reminder preview */}
      <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
        {reminder.is_text ? (
          <p className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-3">
            {reminder.text}
          </p>
        ) : (
          <p className="text-xs text-[hsl(var(--muted-foreground))] italic">
            Image reminder {reminder.caption ? `— ${reminder.caption}` : ""}
          </p>
        )}
      </div>

      {/* Reflections list */}
      <ScrollArea className="flex-1 px-4">
        {isLoading ? (
          <div className="py-8 text-center text-[hsl(var(--muted-foreground))] text-sm">
            Loading...
          </div>
        ) : reflections.length === 0 ? (
          <div className="py-8 text-center text-[hsl(var(--muted-foreground))] text-sm">
            No reflections yet. Be the first!
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-3">
            {reflections.map((reflection) => {
              const initials =
                reflection.user_full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() ?? "?";
              const isOwn = user?.id === reflection.user_id;

              return (
                <div key={reflection.id} className="flex flex-col gap-1.5">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage
                        src={reflection.user_img_url ?? ""}
                        alt={reflection.user_full_name}
                      />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-medium truncate">
                          {reflection.user_full_name}
                        </span>
                        {isOwn && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]"
                            onClick={() => handleDelete(reflection.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        @{reflection.username}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm pl-9 leading-snug">{reflection.content}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] pl-9">
                    {formatDistanceToNow(new Date(reflection.updated_at), { addSuffix: true })}
                  </p>
                  <Separator />
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Add reflection */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[hsl(var(--border))] flex gap-2">
        <Textarea
          placeholder="Add a reflection..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={2}
          className="flex-1 text-sm resize-none"
        />
        <Button type="submit" size="icon" disabled={isSending || !newContent.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
