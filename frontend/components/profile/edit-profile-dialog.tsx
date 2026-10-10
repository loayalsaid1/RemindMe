"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { profileDraftSchema, type ProfileDraft, type UserFull } from "@/schemas/user";
import { useUpdateProfile } from "@/hooks/use-user-profile";
import { uploadImage } from "@/api/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserFull;
}

export function EditProfileDialog({ open, onOpenChange, user }: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-h-[90dvh] max-w-md overflow-y-auto border-white/10">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        {open ? (
          <EditProfileForm user={user} onDone={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditProfileForm({
  user,
  onDone,
}: {
  user: UserFull;
  onDone: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const updateProfile = useUpdateProfile(user.id);
  const form = useForm<ProfileDraft>({
    resolver: zodResolver(profileDraftSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      description: user.description ?? "",
      img_url: user.img_url,
    },
  });

  async function submitProfile(values: ProfileDraft) {
    await updateProfile.mutateAsync(values);
    onDone();
  }

  const photo = useWatch({ control: form.control, name: "img_url" });
  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();

  return (
        <Form {...form}>
          <form
            onSubmit={(event) => {
              void form.handleSubmit(submitProfile)(event);
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-20 w-20 border-2 border-brand/30">
                <AvatarImage src={photo ?? ""} alt={user.first_name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <input
                key={fileKey}
                id="profile-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const url = await uploadImage(file);
                    form.setValue("img_url", url, { shouldDirty: true });
                  } finally {
                    setUploading(false);
                    setFileKey((value) => value + 1);
                  }
                }}
              />
              <label
                htmlFor="profile-photo"
                className="surface-shine inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-secondary px-3 text-sm text-secondary-foreground"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload photo"}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input autoComplete="family-name" {...field} />
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
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Tell us a bit about yourself..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="surface-cta surface-shine border-0"
              disabled={updateProfile.isPending || uploading}
            >
              {updateProfile.isPending ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </Form>
  );
}
