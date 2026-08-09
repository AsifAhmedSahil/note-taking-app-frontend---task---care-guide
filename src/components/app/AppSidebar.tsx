"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth";
import {
  IconClose,
  IconLogout,
  IconNote,
  IconPlus,
  IconSettings,
  IconUser,
} from "@/components/icons";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-muted/10 text-foreground"
          : "text-muted hover:bg-muted/10 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isNotesActive = pathname === "/" || pathname.startsWith("/notes");
  const isSettingsActive = pathname === "/settings";
  const isAdminUsersActive = pathname === "/admin/users";
  const isAdminNotesActive = pathname === "/admin/notes";
  const isAdminInterestsActive = pathname === "/admin/interests";

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-muted/10 hover:text-foreground md:hidden"
            aria-label="Close navigation"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
        <div className="px-3 pt-2">
          <Button className="w-full" onClick={() => router.push("/notes/new")}>
            <IconPlus className="h-4 w-4" />
            New Note
          </Button>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          <NavItem
            icon={<IconNote className="h-4 w-4" />}
            label="All Notes"
            active={isNotesActive}
            onClick={() => handleNavigate("/")}
          />
          {user?.role === "admin" ? (
            <>
              <p className="px-3 pb-1 pt-4 text-xs font-medium text-muted">
                Admin
              </p>
              <NavItem
                icon={<IconNote className="h-4 w-4" />}
                label="Notes"
                active={isAdminNotesActive}
                onClick={() => handleNavigate("/admin/notes")}
              />
              <NavItem
                icon={<IconUser className="h-4 w-4" />}
                label="Users"
                active={isAdminUsersActive}
                onClick={() => handleNavigate("/admin/users")}
              />
              <NavItem
                icon={<IconUser className="h-4 w-4" />}
                label="Interests"
                active={isAdminInterestsActive}
                onClick={() => handleNavigate("/admin/interests")}
              />
            </>
          ) : null}
        </nav>
        <div className="flex flex-col gap-1 border-t border-border px-3 py-4">
          <NavItem
            icon={<IconSettings className="h-4 w-4" />}
            label="Settings"
            active={isSettingsActive}
            onClick={() => handleNavigate("/settings")}
          />
          <NavItem
            icon={<IconLogout className="h-4 w-4" />}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </aside>
    </>
  );
}
