"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Globe, Home, LogOut, Plus, Search, User, X } from "lucide-react";
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
import { HeaderStreak } from "@/components/layout/header-streak";
import { ProfileModal } from "@/components/profile/profile-modal";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  isOwnProfile?: boolean;
  onAddReminder?: () => void;
}

export function Header({
  onSearch,
  searchPlaceholder = "Search by username or text…",
  isOwnProfile,
  onAddReminder,
}: HeaderProps) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
      <header className="surface-header flex h-14 items-center justify-between gap-2 border-b border-white/10 px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary logo-link">
            <div className="logo-glow relative h-8 w-28 shrink-0 sm:w-32">
              <Image src="/logo.png" alt="RemindMe" fill className="object-contain drop-shadow" priority />
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
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
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

          {/* Streak indicator — visible on mobile only (desktop has it in sidebar) */}
          <HeaderStreak user={user} className="md:hidden" />

          {/* Mobile search toggle button */}
          {onSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:hidden"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Add Reminder button — shown for own profile / home */}
          {isOwnProfile && onAddReminder && (
            <Button
              size="sm"
              className="surface-cta h-8 px-2.5 text-xs font-semibold md:hidden"
              onClick={onAddReminder}
              aria-label="Add Reminder"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              <span>Add</span>
            </Button>
          )}

          {/* Desktop account menu */}
          <div className="hidden md:flex">
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
                    <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
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
        </div>
      </header>

      {/* Mobile search row — expands below header when toggled */}
      {mobileSearchOpen && onSearch && (
        <div className="flex items-center gap-2 border-b border-white/10 bg-[var(--ink-800)] px-3 py-2 sm:hidden animate-slide-up">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={mobileQuery}
            placeholder={searchPlaceholder}
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(event) => handleMobileSearch(event.target.value)}
            aria-label="Search"
          />
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={closeMobileSearch} aria-label="Close search">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Profile Modal on Desktop */}
      <ProfileModal
        user={user}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </div>
  );
}
