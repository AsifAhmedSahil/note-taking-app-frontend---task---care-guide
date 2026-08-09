"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { AccountSection } from "@/components/settings/AccountSection";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth";

function SettingsContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace("/");
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8">
        <Button variant="ghost" onClick={handleBack}>
          ← Settings
        </Button>

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Account
        </h1>

        <div className="mt-6 flex flex-col gap-6">
          <AccountSection title="Profile">
            <dl className="divide-y divide-border">
              <div className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted">Name</dt>
                <dd className="text-sm font-medium text-foreground">
                  {user?.name ?? "—"}
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted">Email</dt>
                <dd className="text-sm font-medium text-foreground">
                  {user?.email ?? "—"}
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted">Role</dt>
                <dd className="text-sm font-medium text-foreground">
                  {user?.role ?? "—"}
                </dd>
              </div>
            </dl>
          </AccountSection>

          <AccountSection
            title="Sign out"
            description="Sign out of this account"
            action={
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            }
          />
        </div>
      </div>
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  );
}