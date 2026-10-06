"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2, X } from "lucide-react";
import { reflectionDraftSchema, type ReflectionDraft } from "@/schemas/reflection";
import type { ReminderFull } from "@/schemas/reminder";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCreateReflection, useDeleteReflection, useReflections } from "@/hooks/use-reflections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface ReflectionsPanelProps {
  reminder: ReminderFull | null;
  onClose: () => void;
}

export function ReflectionsPanel({ reminder, onClose }: ReflectionsPanelProps) {
  const { data: user } = useCurrentUser();
  const reminderId = reminder?.id ?? "";
  const { data: reflections = [], isLoading } = useReflections(reminder?.id);
  const createReflection = useCreateReflection(reminderId);
  const deleteReflection = useDeleteReflection(reminderId);
  const form = useForm<ReflectionDraft>({
    resolver: zodResolver(reflectionDraftSchema),
    defaultValues: { content: "" },
  });

  if (!reminder) return null;

  const onSubmit = form.handleSubmit(async (values) => {
    await createReflection.mutateAsync(values);
    form.reset({ content: "" });
  });

  return (
    <aside className="surface-panel flex h-full w-80 flex-col border-l border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold">Reflections</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} aria-label="Close reflections">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-b border-white/10 px-4 py-3">
        {reminder.is_text ? (
          <p className="line-clamp-3 text-xs text-muted-foreground">{reminder.text}</p>
        ) : (
          <p className="text-xs italic text-muted-foreground">
            Image reminder {reminder.caption ? `— ${reminder.caption}` : ""}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
        ) : reflections.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No reflections yet. Be the first!
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-3">
            {reflections.map((reflection) => {
              const initials =
                reflection.user_full_name
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase() ?? "?";
              const isOwn = user?.id === reflection.user_id;
              const stamp = Date.parse(reflection.updated_at);

              return (
                <div key={reflection.id} className="flex flex-col gap-1.5">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={reflection.user_img_url ?? ""} alt={reflection.user_full_name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-medium">{reflection.user_full_name}</span>
                        {isOwn && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                            aria-label="Delete reflection"
                            onClick={() => deleteReflection.mutate(reflection.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">@{reflection.username}</p>
                    </div>
                  </div>
                  <p className="pl-9 text-sm leading-snug">{reflection.content}</p>
                  <p className="pl-9 text-xs text-muted-foreground">
                    {Number.isNaN(stamp)
                      ? reflection.updated_at
                      : formatDistanceToNow(new Date(stamp), { addSuffix: true })}
                  </p>
                  <Separator />
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex gap-2 border-t border-white/10 p-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea placeholder="Add a reflection..." rows={2} className="resize-none text-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            className="surface-cta border-0"
            disabled={createReflection.isPending}
            aria-label="Send reflection"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </aside>
  );
}
