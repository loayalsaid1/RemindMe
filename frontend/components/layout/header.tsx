"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Home, LogOut, Search, User, X } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
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
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function Header({ onSearch, searchPlaceholder = "Search by username or text…" }: HeaderProps) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  function handleMobileSearch(value: string) {
    setMobileQuery(value);
    onSearch?.(value);
  }

  function closeMobileSearch() {
    setMobileSearchOpen(false);
    setMobileQuery("");
    onSearch?.("");
  }

  return (
    <div className="relative z-40">
      <header className="surface-header flex h-14 items-center gap-4 border-b border-white/10 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary logo-link">
          <div className="logo-glow relative h-8 w-32 shrink-0">
            <Image src="/logo.png" alt="RemindMe" fill className="object-contain drop-shadow" />
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>My Reminders</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/public" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Public</span>
            </Link>
          </Button>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Desktop search */}
          <div className="relative hidden w-full max-w-xs sm:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-8"
              onChange={(event) => onSearch?.(event.target.value)}
              aria-label="Search"
            />
          </div>

          {/* Mobile search toggle — only shown when page supports search */}
          {onSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Search"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
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

      {/* Mobile search row — expands below header on small screens */}
      {mobileSearchOpen && onSearch && (
        <div className="flex items-center gap-2 border-b border-white/10 bg-[var(--ink-800)] px-4 py-2 sm:hidden">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={mobileQuery}
            placeholder={searchPlaceholder}
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(event) => handleMobileSearch(event.target.value)}
            aria-label="Search"
          />
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={closeMobileSearch}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
