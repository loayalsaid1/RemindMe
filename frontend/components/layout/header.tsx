"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Home, LogOut, Menu, Search, User } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { checkUsername } from "@/api/users";
import { useToast } from "@/hooks/use-toast";
import { RemindMeLogo } from "@/components/brand/remindme-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  async function submitUsernameSearch() {
    const username = query.trim().replace(/^@/, "");
    if (!username) return;
    setSearching(true);
    try {
      const result = await checkUsername(username);
      if (result.exists) {
        setQuery("");
        router.push(`/user/${username}`);
      } else {
        toast({
          title: `No user with username ${username}.`,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Search is unavailable right now",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  }

  return (
    <header className="surface-header surface-enter-header relative z-40 flex h-14 items-center gap-2 px-3 md:h-[70px] md:gap-4 md:px-6">
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <RemindMeLogo size="sm" className="shrink-0 md:hidden" />
      <RemindMeLogo size="md" className="hidden shrink-0 md:inline-flex" />

      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "relative",
            pathname === "/" && "font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-full after:rounded-sm after:bg-gradient-to-r after:from-brand after:to-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Your reminders
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "relative",
            pathname === "/public" && "font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-full after:rounded-sm after:bg-gradient-to-r after:from-brand after:to-transparent"
          )}
        >
          <Link href="/public" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            Public reminders
          </Link>
        </Button>
      </nav>

      <div className="ml-auto flex min-w-0 items-center justify-end gap-2">
        <form
          className="relative flex min-w-0 max-w-[11rem] items-center sm:max-w-xs"
          onSubmit={(event) => {
            event.preventDefault();
            void submitUsernameSearch();
          }}
        >
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for username"
            className="h-11 pl-8 sm:h-9"
            aria-label="Search for username"
            autoComplete="off"
          />
          {searching && (
            <span className="absolute right-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          )}
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full md:h-10 md:w-10" aria-label="Account menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.img_url ?? ""} alt={user?.first_name ?? "User"} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user && (
              <>
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">@{user.user_name}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/user/${user.user_name}`)}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => logout.mutate()} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
