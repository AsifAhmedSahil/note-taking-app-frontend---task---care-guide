"use client";

import { IconMenu, IconSearch } from "@/components/icons";
import { useAuth } from "@/lib/auth";

type AppHeaderProps = {
  onMenuClick: () => void;
};

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "U";

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 md:gap-4 md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-muted/10 hover:text-foreground md:hidden"
        aria-label="Open navigation"
      >
        <IconMenu className="h-4 w-4" />
      </button>
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        My Notes
      </h1>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search notes"
            className="h-9 w-56 rounded-control border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent"
            aria-label={user?.name ?? "User"}
          >
            {initials}
          </div>
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium leading-tight text-foreground">
              {user?.name}
            </p>
            <p className="text-xs leading-tight text-muted">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
