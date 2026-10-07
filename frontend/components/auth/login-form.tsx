"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { loginDraftSchema, type LoginDraft } from "@/schemas/user";
import { useLogin } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
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

export function LoginForm() {
  const { toast } = useToast();
  const loginMutation = useLogin();
  const form = useForm<LoginDraft>({
    resolver: zodResolver(loginDraftSchema),
    defaultValues: { identifier: "", password: "", remember: false },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="surface-auth w-full max-w-sm border-white/10">
      <CardHeader className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Bell className="h-8 w-8" aria-hidden="true" />
          <span className="text-2xl font-bold">RemindMe</span>
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Welcome back to your daily reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or username</FormLabel>
                  <FormControl>
                    <Input  autoComplete="username" placeholder="you@example.com or username" {...field} />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <span className="text-xs text-primary">Forgot password?</span>
                  </div>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-muted-foreground">Remember me</FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" className="surface-cta w-full border-0" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="relative z-10 justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
