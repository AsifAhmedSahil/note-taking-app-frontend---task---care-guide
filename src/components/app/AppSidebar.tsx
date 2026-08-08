"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import {
  IconClose,
  IconLogout,
  IconNote,
  IconPlus,
  IconSettings,
} from "@/components/icons";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      type="button"
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
          <Button className="w-full">
            <IconPlus className="h-4 w-4" />
            New Note
          </Button>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          <NavItem
            icon={<IconNote className="h-4 w-4" />}
            label="All Notes"
            active
          />
        </nav>
        <div className="flex flex-col gap-1 border-t border-border px-3 py-4">
          <NavItem icon={<IconSettings className="h-4 w-4" />} label="Settings" />
          <NavItem icon={<IconLogout className="h-4 w-4" />} label="Logout" />
        </div>
      </aside>
    </>
  );
}
