"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminNotesList } from "@/components/admin/AdminNotesList";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { getAdminNotes } from "@/lib/api";
import type { AdminNote, NotesPagination } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { IconNote } from "@/components/icons";

const PAGE_SIZE = 10;

type ViewState =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "empty" }
  | { kind: "accessDenied" }
  | { kind: "error"; message: string };

function AdminNotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const { token, logout } = useAuth();
  const [view, setView] = useState<ViewState>({ kind: "loading" });
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [pagination, setPagination] = useState<NotesPagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [prevSearch, setPrevSearch] = useState(search);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setPage(1);
    setView({ kind: "loading" });
  }

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

    getAdminNotes(token, page, PAGE_SIZE, search)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setNotes(result.notes);
          setPagination(result.pagination);
          setView(result.notes.length > 0 ? { kind: "list" } : { kind: "empty" });
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
  }, [token, page, search, reloadKey, handleUnauthorized]);

  const retry = () => {
    setView({ kind: "loading" });
    setReloadKey((key) => key + 1);
  };

  const handlePageChange = (nextPage: number) => {
    setView({ kind: "loading" });
    setPage(nextPage);
  };

  const clearSearch = () => {
    router.replace("/admin/notes");
  };

  if (view.kind === "loading") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted">Loading notes...</p>
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
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <Button variant="ghost" onClick={handleBack}>
          ← Back
        </Button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {search.trim() ? `Search results for "${search.trim()}"` : "Notes"}
            </h1>
            <p className="mt-1.5 text-sm text-muted">All notes across the application</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm text-muted">
              {pagination.total} {pagination.total === 1 ? "note" : "notes"}
            </p>
            {search.trim() ? (
              <Button variant="secondary" onClick={clearSearch}>
                Clear search
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          {view.kind === "empty" ? (
            <EmptyState
              icon={<IconNote className="h-6 w-6 text-muted" />}
              title={search.trim() ? "No notes found" : "No notes yet"}
              description={
                search.trim()
                  ? `No notes match "${search.trim()}". Try a different search.`
                  : "There are no notes to display."
              }
              action={
                search.trim() ? (
                  <Button variant="secondary" onClick={clearSearch}>
                    Clear search
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <AdminNotesList
              notes={notes}
              pagination={pagination}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function AdminNotesPage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <AdminNotesContent />
      </Suspense>
    </RequireAuth>
  );
}