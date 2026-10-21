"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2, X } from "lucide-react";
import { reflectionDraftSchema, type ReflectionDraft } from "@/schemas/reflection";
import type { ReminderFull } from "@/schemas/reminder";
import type { ReflectionFull } from "@/schemas/reflection";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCreateReflection, useDeleteReflection, useReflections } from "@/hooks/use-reflections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

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

  const handleDelete = (id: string) => {
    deleteReflection.mutate(id);
  };

  return (
    <>
      {/* Desktop view: side panel */}
      <aside
        className="surface-panel hidden h-full w-80 flex-col border-l border-white/10 md:flex"
        aria-label="Reflections Side Panel"
      >
        <ReflectionsHeader onClose={onClose} />
        <ReminderPreview reminder={reminder} />
        <ReflectionsList
          reflections={reflections}
          isLoading={isLoading}
          currentUserId={user?.id}
          onDelete={handleDelete}
        />
        <ReflectionInput
          form={form}
          onSubmit={onSubmit}
          isPending={createReflection.isPending}
        />
      </aside>

      {/* Mobile view: slide-up bottom sheet modal (z-[70] to sit strictly above z-50 mobile navbar) */}
      <div
        className="fixed inset-0 z-[70] flex flex-col justify-end bg-black/75 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-label="Reflections Bottom Sheet Modal"
      >
        <div
          className="surface-panel animate-slide-up relative z-[75] flex max-h-[88dvh] w-full flex-col rounded-t-2xl border-t border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile pull indicator */}
          <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/20" />
          <ReflectionsHeader onClose={onClose} />
          <ReminderPreview reminder={reminder} compact />
          <ReflectionsList
            reflections={reflections}
            isLoading={isLoading}
            currentUserId={user?.id}
            onDelete={handleDelete}
          />
          <div className="border-t border-white/10 bg-[var(--ink-900)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
            <ReflectionInput
              form={form}
              onSubmit={onSubmit}
              isPending={createReflection.isPending}
              noBorder
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ReflectionsHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <h3 className="text-sm font-semibold text-foreground">Reflections</h3>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={onClose}
        aria-label="Close reflections"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ReminderPreview({
  reminder,
  compact = false,
}: {
  reminder: ReminderFull;
  compact?: boolean;
}) {
  return (
    <div className="border-b border-white/10 bg-white/[0.02]">
      {reminder.is_text ? (
        <div className="px-4 py-3">
          <p
            className={cn(
              "text-xs leading-relaxed text-muted-foreground",
              compact ? "line-clamp-2" : "line-clamp-4"
            )}
          >
            {reminder.text}
          </p>
          {reminder.caption && (
            <p className="mt-1 text-xs italic text-muted-foreground/60">{reminder.caption}</p>
          )}
        </div>
      ) : reminder.img_url ? (
        <div className="flex flex-col">
          <div className={cn("relative w-full overflow-hidden", compact ? "h-28" : "h-36")}>
            {/* Blurred bg fill */}
            <Image
              src={reminder.img_url}
              alt=""
              fill
              className="scale-110 object-cover blur-md brightness-50"
              aria-hidden
              sizes="(max-width: 768px) 100vw, 320px"
            />
            {/* Contained image */}
            <Image
              src={reminder.img_url}
              alt={reminder.caption ?? "Reminder image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
          {reminder.caption && (
            <p className="line-clamp-1 px-4 py-1.5 text-xs italic text-muted-foreground">
              {reminder.caption}
            </p>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 text-xs italic text-muted-foreground">Reminder</div>
      )}
    </div>
  );
}

interface ReflectionsListProps {
  reflections: ReflectionFull[];
  isLoading: boolean;
  currentUserId?: string;
  onDelete: (id: string) => void;
}

function ReflectionsList({
  reflections,
  isLoading,
  currentUserId,
  onDelete,
}: ReflectionsListProps) {
  return (
    <ScrollArea className="flex-1 px-4">
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">Loading reflections...</div>
      ) : reflections.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No reflections yet. Be the first to reflect!
        </div>
      ) : (
        <div className="flex flex-col gap-3 py-3">
          {reflections.map((reflection) => {
            const initials =
              reflection.user_full_name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .toUpperCase() || "?";
            const isOwn = currentUserId === reflection.user_id;
            const stamp = Date.parse(reflection.updated_at);

            return (
              <div key={reflection.id} className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <Link
                    href={reflection.username ? `/user/${reflection.username}` : "#"}
                    className="shrink-0"
                    aria-label={`View ${reflection.user_full_name}'s profile`}
                  >
                    <Avatar className="h-7 w-7 transition-opacity hover:opacity-80">
                      <AvatarImage src={reflection.user_img_url ?? ""} alt={reflection.user_full_name} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <Link
                        href={reflection.username ? `/user/${reflection.username}` : "#"}
                        className="truncate text-xs font-medium hover:underline"
                      >
                        {reflection.user_full_name}
                      </Link>
                      {isOwn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label="Delete reflection"
                          onClick={() => onDelete(reflection.id)}
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
  );
}

interface ReflectionInputProps {
  form: UseFormReturn<ReflectionDraft>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  noBorder?: boolean;
}

function ReflectionInput({ form, onSubmit, isPending, noBorder = false }: ReflectionInputProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          "flex gap-2 p-3 sm:p-4",
          !noBorder && "border-t border-white/10"
        )}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Add a reflection..."
                  rows={2}
                  className="resize-none text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          className="surface-cta shrink-0 border-0 self-end h-10 w-10"
          disabled={isPending}
          aria-label="Send reflection"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
