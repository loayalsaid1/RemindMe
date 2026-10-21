"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Trash2 } from "lucide-react";
import { profileDraftSchema, type ProfileDraft, type UserFull } from "@/schemas/user";
import { useUpdateProfile } from "@/hooks/use-profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface EditProfileDialogProps {
  user: UserFull;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
  const updateProfile = useUpdateProfile(user.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileDraft>({
    resolver: zodResolver(profileDraftSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      description: user.description ?? "",
      image: null,
      remove_image: false,
    },
  });

  const removeImage = useWatch({ control: form.control, name: "remove_image" });

  useEffect(() => {
    if (open) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        description: user.description ?? "",
        image: null,
        remove_image: false,
      });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, user, form]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("image", file, { shouldDirty: true });
      form.setValue("remove_image", false, { shouldDirty: true });
    }
  }

  function handleRemovePhoto() {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    form.setValue("image", null, { shouldDirty: true });
    form.setValue("remove_image", true, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: ProfileDraft) {
    await updateProfile.mutateAsync(values);
    onOpenChange(false);
  }

  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase() || "?";
  const displayImageSrc = previewUrl || (removeImage ? "" : (user.img_url ?? ""));
  const hasPhoto = Boolean(previewUrl || (!removeImage && user.img_url));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-w-md border-white/10 p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">Edit Profile</DialogTitle>
        </DialogHeader>

        {/* Profile photo picker section */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-primary/40 shadow-lg">
              <AvatarImage src={displayImageSrc} alt={user.first_name} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>

            {/* Quick camera tap trigger on top of avatar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 cursor-pointer"
              aria-label="Upload profile photo"
            >
              <Camera className="h-6 w-6" />
              <span className="text-[10px] font-medium mt-0.5">Upload</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-white/10 text-xs font-medium hover:bg-white/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {hasPhoto ? "Change Photo" : "Upload Photo"}
            </Button>

            {hasPhoto && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleRemovePhoto}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>

          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Choose profile image file"
          />
        </div>

        <Form {...form}>
          <form
            onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="A short bio about yourself…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="surface-cta border-0 font-semibold"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving…" : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
