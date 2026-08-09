"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { InterestGroupsList } from "@/components/admin/InterestGroupsList";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { getInterestGroups } from "@/lib/api";
import type { InterestGroup } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { IconUser } from "@/components/icons";

type ViewState =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "empty" }
  | { kind: "accessDenied" }
  | { kind: "error"; message: string };

function AdminInterestsContent() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [view, setView] = useState<ViewState>({ kind: "loading" });
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  const handleUnauthorized = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace("/");
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getInterestGroups(token)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setGroups(result.groups);
          setView(result.groups.length > 0 ? { kind: "list" } : { kind: "empty" });
        } else if (result.status === 401) {
          handleUnauthorized();
        } else if (result.status === 403) {
          setView({ kind: "accessDenied" });
        } else {
          setView({ kind: "error", message: result.message });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setView({
            kind: "error",
            message: "Something went wrong. Please try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, reloadKey, handleUnauthorized]);

  const retry = () => {
    setView({ kind: "loading" });
    setReloadKey((key) => key + 1);
  };

  if (view.kind === "loading") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted">Loading interests...</p>
        </div>
      </AppShell>
    );
  }

  if (view.kind === "accessDenied") {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Access denied
          </h2>
          <p className="text-sm text-muted">
            You do not have permission to view this page.
          </p>
          <Button variant="secondary" className="mt-2" onClick={handleBack}>
            Back
          </Button>
        </div>
      </AppShell>
    );
  }

  if (view.kind === "error") {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted">{view.message}</p>
            <Button variant="secondary" onClick={() => retry()}>
              Try again
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
        <Button variant="ghost" onClick={handleBack}>
          ← Back
        </Button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Interests
            </h1>
            <p className="mt-1 text-sm text-muted">Users grouped by interest</p>
          </div>
          <p className="text-sm text-muted">
            {groups.length} {groups.length === 1 ? "interest" : "interests"}
          </p>
        </div>

        <div className="mt-6">
          {view.kind === "empty" ? (
            <EmptyState
              icon={<IconUser className="h-6 w-6 text-muted" />}
              title="No interests yet"
              description="No users have added interests."
            />
          ) : (
            <InterestGroupsList groups={groups} />
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function AdminInterestsPage() {
  return (
    <RequireAuth>
      <AdminInterestsContent />
    </RequireAuth>
  );
}