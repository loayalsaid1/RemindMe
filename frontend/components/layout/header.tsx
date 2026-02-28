"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Globe, Home, LogOut, Search, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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

interface HeaderProps {
  onSearch?: (q: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 md:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-[hsl(var(--primary))]">
        <Bell className="h-5 w-5" />
        <span className="hidden sm:inline">RemindMe</span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">My Reminders</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/public" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Public</span>
          </Link>
        </Button>
      </nav>

      {/* Search */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <div className="relative max-w-xs w-full hidden sm:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Search reminders..."
            className="pl-8"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
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
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-[hsl(var(--muted-foreground))] text-xs">@{user.user_name}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/user/${user.user_name}`)}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={logout} className="text-[hsl(var(--destructive))]">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
