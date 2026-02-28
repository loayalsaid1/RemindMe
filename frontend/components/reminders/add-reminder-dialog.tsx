"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImageIcon, Type, Upload } from "lucide-react";
import { createReminder, type Reminder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (reminder: Reminder) => void;
}

type Tab = "text" | "image";

export function AddReminderDialog({ open, onOpenChange, onCreated }: AddReminderDialogProps) {
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const reset = () => {
    setText("");
    setCaption("");
    setVisibility("private");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let reminder: Reminder;
      if (tab === "text") {
        reminder = await createReminder({
          text,
          caption: caption || undefined,
          is_text: true,
          public: visibility === "public",
        });
      } else {
        if (!imageFile) {
          toast({ title: "Please select an image", variant: "destructive" });
          return;
        }
        const formData = new FormData();
        formData.append("image", imageFile);
        if (caption) formData.append("caption", caption);
        formData.append("is_text", "false");
        formData.append("public", String(visibility === "public"));
        reminder = await createReminder(formData);
      }
      toast({ title: "Reminder created!" });
      onCreated?.(reminder);
      reset();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Failed to create reminder",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 rounded-md bg-[hsl(var(--muted))]">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "text"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            <Type className="h-4 w-4" /> Text
          </button>
          <button
            type="button"
            onClick={() => setTab("image")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === "image"
                ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            <ImageIcon className="h-4 w-4" /> Image
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === "text" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="reminder-text">Text</Label>
              <Textarea
                id="reminder-text"
                placeholder="Your reminder text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                required
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Image</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <div className="relative rounded-md overflow-hidden aspect-video">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="400px" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[hsl(var(--border))] rounded-md py-8 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] transition-colors"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Click to upload image</span>
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(v) => setVisibility(v as "public" | "private")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="private" id="vis-private" />
                <Label htmlFor="vis-private">Private</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="public" id="vis-public" />
                <Label htmlFor="vis-public">Public</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Reminder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
