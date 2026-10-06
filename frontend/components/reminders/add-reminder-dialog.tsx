"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Type, Upload, X } from "lucide-react";
import { reminderDraftSchema, type ReminderDraft } from "@/schemas/reminder";
import { useCreateReminder } from "@/hooks/use-reminders";
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
import { cn } from "@/lib/utils";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyDraft: ReminderDraft = {
  tab: "text",
  text: "",
  caption: "",
  visibility: "private",
  image: null,
};

export function AddReminderDialog({ open, onOpenChange }: AddReminderDialogProps) {
  const [fileKey, setFileKey] = useState(0);
  const createReminder = useCreateReminder();
  const form = useForm<ReminderDraft>({
    resolver: zodResolver(reminderDraftSchema),
    defaultValues: emptyDraft,
  });

  const tab = useWatch({ control: form.control, name: "tab" });
  const image = useWatch({ control: form.control, name: "image" });
  const preview = image ? URL.createObjectURL(image) : null;

  const reset = () => {
    form.reset(emptyDraft);
    setFileKey((value) => value + 1);
  };

  async function submitDraft(values: ReminderDraft) {
    if (values.tab === "text" && !values.text?.trim()) {
      form.setError("text", { message: "Text is required" });
      return;
    }
    if (values.tab === "image" && !values.image) {
      form.setError("image", { message: "Please select an image" });
      return;
    }
    await createReminder.mutateAsync(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="surface-card max-w-md border-white/10">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 rounded-md bg-muted p-1">
          {(["text", "image"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => form.setValue("tab", value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
                tab === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {value === "text" ? <Type className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
              {value === "text" ? "Text" : "Image"}
            </button>
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={(event) => {
              void form.handleSubmit(submitDraft)(event);
            }}
            className="flex flex-col gap-4"
          >
            {tab === "text" ? (
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
                      key={fileKey}
                      id="reminder-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        form.setValue("image", file, { shouldValidate: true });
                      }}
                    />
                    {preview ? (
                      <div className="relative aspect-video overflow-hidden rounded-md">
                        <Image src={preview} alt="Preview" fill className="object-cover" sizes="400px" />
                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={() => {
                            form.setValue("image", null);
                            setFileKey((value) => value + 1);
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="reminder-image"
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary"
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
                        <RadioGroupItem value="private" id="vis-private" />
                        <Label htmlFor="vis-private">Private</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="public" id="vis-public" />
                        <Label htmlFor="vis-public">Public</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="surface-cta border-0" disabled={createReminder.isPending}>
              {createReminder.isPending ? "Creating..." : "Create Reminder"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
