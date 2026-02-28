"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { registerUser } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await registerUser({ email, password, first_name: firstName, last_name: lastName });
      await login(email, password);
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-[hsl(var(--primary))]">
          <Bell className="h-8 w-8" />
          <span className="text-2xl font-bold">RemindMe</span>
        </div>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription className="text-center text-xs">
          Everyday, refresh ideas, principles, inspirations or whys you want to live with
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 rounded border-[hsl(var(--border))] accent-[hsl(var(--primary))]"
            />
            <Label htmlFor="terms" className="text-xs font-normal text-[hsl(var(--muted-foreground))]">
              I agree to the{" "}
              <Link href="#" className="text-[hsl(var(--primary))] hover:underline">
                Terms of Service
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full mt-1" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Already have an account?{" "}
          <Link href="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
