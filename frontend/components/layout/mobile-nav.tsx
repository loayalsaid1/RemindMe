"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileNav() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  const isHome = pathname === "/";
  const isDiscover = pathname.startsWith("/public");
  const isProfile = Boolean(
    user?.user_name && pathname.startsWith(`/user/${user.user_name}`)
  );

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  const profileHref = user ? `/user/${user.user_name}` : "/login";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/10 pb-safe md:hidden"
      style={{ background: "linear-gradient(to top, var(--ink-900), var(--ink-800))" }}
      aria-label="Mobile Navigation"
    >
      {/* Home tab */}
      <Link
        href="/"
        aria-current={isHome ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors",
          isHome
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home className={cn("h-5 w-5", isHome && "stroke-[2.5px]")} />
        {/* <span>Home</span> */}
        <span>My Reminders</span>

      </Link>

      {/* Discover tab */}
      <Link
        href="/public"
        aria-current={isDiscover ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors",
          isDiscover
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Compass className={cn("h-5 w-5", isDiscover && "stroke-[2.5px]")} />
        {/* <span>Discover</span> */}
        <span>Public Reminders</span>
      </Link>

      {/* Profile tab */}
      <Link
        href={profileHref}
        aria-current={isProfile ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors",
          isProfile
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {user ? (
          <Avatar
            className={cn(
              "h-5 w-5 transition-all",
              isProfile && "ring-2 ring-primary ring-offset-1 ring-offset-[var(--ink-900)]"
            )}
          >
            <AvatarImage src={user.img_url ?? ""} alt={user.first_name} />
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
        ) : (
          <User className={cn("h-5 w-5", isProfile && "stroke-[2.5px]")} />
        )}
        <span>Profile</span>
      </Link>
    </nav>
  );
}
