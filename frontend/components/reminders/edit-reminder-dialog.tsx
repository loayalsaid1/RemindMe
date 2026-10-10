"use client";

import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { reminderDraftSchema, type ReminderDraft, type ReminderFull } from "@/schemas/reminder";
import { useUpdateReminder } from "@/hooks/use-reminders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface EditReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: ReminderFull;
}

export function EditReminderDialog({ open, onOpenChange, reminder }: EditReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-h-[90dvh] max-w-md overflow-y-auto border-white/10">
        <DialogHeader>
          <DialogTitle>Edit reminder</DialogTitle>
        </DialogHeader>
        {open ? (
          <EditReminderForm reminder={reminder} onDone={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditReminderForm({
  reminder,
  onDone,
}: {
  reminder: ReminderFull;
  onDone: () => void;
}) {
  const updateReminder = useUpdateReminder();
  const form = useForm<ReminderDraft>({
    resolver: zodResolver(reminderDraftSchema),
    defaultValues: {
      tab: reminder.is_text ? "text" : "image",
      text: reminder.text ?? "",
      caption: reminder.caption ?? "",
      visibility: reminder.public ? "public" : "private",
      image: null,
    },
  });

  const image = useWatch({ control: form.control, name: "image" });
  const preview = image ? URL.createObjectURL(image) : reminder.img_url;

  async function submitDraft(values: ReminderDraft) {
    if (values.tab === "text" && !values.text?.trim()) {
      form.setError("text", { message: "Text is required" });
      return;
    }
    await updateReminder.mutateAsync({
      id: reminder.id,
      patch: values.tab === "text"
        ? {
            is_text: true,
            text: values.text,
            caption: values.caption || null,
            public: values.visibility === "public",
          }
        : {
            is_text: false,
            caption: values.caption || null,
            public: values.visibility === "public",
            image: values.image ?? undefined,
          },
    });
    onDone();
  }

  return (
        <Form {...form}>
          <form
            onSubmit={(event) => {
              void form.handleSubmit(submitDraft)(event);
            }}
            className="flex flex-col gap-4"
          >
            {reminder.is_text ? (
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your reminder text..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <input
                      id="edit-reminder-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        form.setValue("image", file, { shouldValidate: true });
                      }}
                    />
                    {preview ? (
                      <div className="surface-media relative aspect-[16/10] overflow-hidden rounded-md">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-contain"
                          sizes="400px"
                          unoptimized={preview.startsWith("blob:")}
                        />
                        <label
                          htmlFor="edit-reminder-image"
                          className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-black/60 p-2 text-white"
                        >
                          <Upload className="h-3.5 w-3.5" />
                        </label>
                      </div>
                    ) : (
                      <label
                        htmlFor="edit-reminder-image"
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-8 text-muted-foreground"
                      >
                        <Upload className="h-8 w-8" />
                        <span className="text-sm">Click to upload image</span>
                      </label>
                    )}
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
                    <Textarea placeholder="Add a caption..." rows={2} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="private" id="edit-vis-private" />
                        <Label htmlFor="edit-vis-private">Private</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="public" id="edit-vis-public" />
                        <Label htmlFor="edit-vis-public">Public</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="surface-cta surface-shine border-0" disabled={updateReminder.isPending}>
              {updateReminder.isPending ? "Saving..." : "Save reminder"}
            </Button>
          </form>
        </Form>
  );
}
