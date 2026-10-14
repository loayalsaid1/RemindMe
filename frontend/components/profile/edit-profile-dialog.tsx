"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface EditProfileDialogProps {
  user: UserFull;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
  const updateProfile = useUpdateProfile(user.id);
  const form = useForm<ProfileDraft>({
    resolver: zodResolver(profileDraftSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      description: user.description ?? "",
      img_url: user.img_url ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        description: user.description ?? "",
        img_url: user.img_url ?? "",
      });
    }
  }, [open, user, form]);

  async function onSubmit(values: ProfileDraft) {
    await updateProfile.mutateAsync({
      ...values,
      img_url: values.img_url || null,
      description: values.description || undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-w-md border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
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

            <FormField
              control={form.control}
              name="img_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Photo URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://…" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="surface-cta border-0"
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
