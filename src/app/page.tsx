"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotesList } from "@/components/notes/NotesList";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { getNotes } from "@/lib/api";
import type { Note, NotesPagination } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { IconNote, IconPlus } from "@/components/icons";

const PAGE_SIZE = 10;

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const { token, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<NotesPagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevSearch, setPrevSearch] = useState(search);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setPage(1);
    setLoading(true);
  }

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getNotes(token, page, PAGE_SIZE, search)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setNotes(result.notes);
          setPagination(result.pagination);
          setError(null);
        } else if (result.status === 401) {
          logout();
          router.replace("/login");
        } else {
          setError(result.message);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, page, search, reloadKey, logout, router]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setLoading(true);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const clearSearch = () => {
    router.replace("/");
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted">Loading notes...</p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-muted">{error}</p>
          <Button variant="secondary" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      </AppShell>
    );
  }

  if (notes.length === 0) {
    return (
      <AppShell>
        {search.trim() ? (
          <EmptyState
            icon={<IconNote className="h-6 w-6 text-muted" />}
            title="No notes found"
            description={`No notes match "${search.trim()}". Try a different search.`}
            action={
              <Button variant="secondary" onClick={clearSearch}>
                Clear search
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<IconNote className="h-6 w-6 text-muted" />}
            title="No notes yet"
            description="Create your first note to get started."
            action={
              <Button onClick={() => router.push("/notes/new")}>
                <IconPlus className="h-4 w-4" />
                New Note
              </Button>
            }
          />
        )}
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              {search.trim() ? `Search results for "${search.trim()}"` : "All Notes"}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {pagination.total} {pagination.total === 1 ? "note" : "notes"}
            </p>
          </div>
          {search.trim() ? (
            <Button variant="secondary" onClick={clearSearch}>
              Clear search
            </Button>
          ) : null}
        </div>
        <NotesList
          notes={notes}
          pagination={pagination}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
    </RequireAuth>
  );
}