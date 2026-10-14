"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ReminderFull } from "@/schemas/reminder";
import { useUpdateReminder } from "@/hooks/use-reminders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const editSchema = z.object({
  text: z.string().optional(),
  caption: z.string().optional(),
});
type EditDraft = z.infer<typeof editSchema>;

interface EditReminderDialogProps {
  reminder: ReminderFull;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditReminderDialog({ reminder, open, onOpenChange }: EditReminderDialogProps) {
  const updateReminder = useUpdateReminder();
  const form = useForm<EditDraft>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      text: reminder.text ?? "",
      caption: reminder.caption ?? "",
    },
  });

  // Reset form when the reminder changes
  useEffect(() => {
    form.reset({
      text: reminder.text ?? "",
      caption: reminder.caption ?? "",
    });
  }, [reminder.id, form]);

  async function onSubmit(values: EditDraft) {
    const patch: Partial<Pick<ReminderFull, "text" | "caption">> = {};
    if (reminder.is_text && values.text !== undefined) {
      patch.text = values.text;
    }
    if (values.caption !== undefined) {
      patch.caption = values.caption;
    }
    await updateReminder.mutateAsync({
      id: reminder.id,
      patch,
      toastMessage: "Reminder updated",
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-w-md border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}
            className="flex flex-col gap-4"
          >
            {reminder.is_text && (
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Your reminder text…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Add a caption…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="surface-cta border-0"
                disabled={updateReminder.isPending}
              >
                {updateReminder.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
