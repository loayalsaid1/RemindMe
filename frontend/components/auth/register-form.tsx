"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerDraftSchema, type RegisterDraft } from "@/schemas/user";
import { useRegister } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { RemindMeLogo } from "@/components/brand/remindme-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function RegisterForm() {
  const { toast } = useToast();
  const registerMutation = useRegister();
  const form = useForm<RegisterDraft>({
    resolver: zodResolver(registerDraftSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      agreed: false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync(values);
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="surface-auth surface-enter-auth w-full max-w-sm border-white/10">
      <CardHeader className="relative z-10 flex flex-col items-center gap-2">
        <RemindMeLogo href="/" size="lg" auth />
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription className="text-center text-xs">
          Everyday, refresh ideas, principles, inspirations or whys you want to live with
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" autoComplete="given-name" {...field} />
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
                      <Input placeholder="Doe" autoComplete="family-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agreed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FormLabel className="text-xs font-normal text-muted-foreground">
                    I agree to the <span className="text-primary">Terms of Service</span>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="surface-cta surface-shine mt-1 w-full border-0" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="relative z-10 justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
