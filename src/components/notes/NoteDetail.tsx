"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { IconTrash } from "@/components/icons";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { getNote, updateNote, deleteNote } from "@/lib/api";
import type { Note, NoteInput } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type NoteDetailProps = {
  noteId: string;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "notFound" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; note: Note };

export function NoteDetail({ noteId }: NoteDetailProps) {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleUnauthorized = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getNote(token, noteId)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setState({ kind: "loaded", note: result.note });
        } else if (result.status === 401) {
          handleUnauthorized();
        } else if (result.status === 404) {
          setState({ kind: "notFound" });
        } else {
          setState({ kind: "error", message: result.message });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ kind: "error", message: "Something went wrong. Please try again." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, noteId, reloadKey, handleUnauthorized]);

  const retry = () => {
    setState({ kind: "loading" });
    setReloadKey((key) => key + 1);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace("/");
  };

  const handleEditSubmit = async (input: NoteInput): Promise<string | null> => {
    if (!token) return null;
    const result = await updateNote(token, noteId, input);
    if (result.ok) {
      setState({ kind: "loaded", note: result.note });
      setEditing(false);
      return null;
    }
    if (result.status === 401) {
      handleUnauthorized();
      return null;
    }
    return result.message;
  };

  const handleDeleteConfirm = async (): Promise<string | null> => {
    if (!token) return null;
    const result = await deleteNote(token, noteId);
    if (result.ok) {
      router.replace("/");
      return null;
    }
    if (result.status === 401) {
      handleUnauthorized();
      return null;
    }
    return result.message;
  };

  if (state.kind === "loading") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted">Loading note...</p>
        </div>
      </AppShell>
    );
  }

  if (state.kind === "error") {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-10">
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted">{state.message}</p>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button variant="secondary" onClick={retry}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (state.kind === "notFound") {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Note not found
          </h2>
          <p className="text-sm text-muted">
            This note may have been deleted or you may not have access to it.
          </p>
          <Button
            variant="secondary"
            className="mt-2 cursor-pointer"
            onClick={() => router.replace("/")}
          >
            Back to notes
          </Button>
        </div>
      </AppShell>
    );
  }

  const { note } = state;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={handleBack} className="cursor-pointer">
            ← Back to Notes
          </Button>
          {editing ? (
            <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Editing note
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setDeleteOpen(true)}>
                <IconTrash className="h-4 w-4" />
                Delete
              </Button>
              <Button onClick={() => setEditing(true)}>
                Edit
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="rounded-[18px] border border-border bg-surface p-6 shadow-card transition-shadow sm:p-8">
            <NoteEditor
              initialTitle={note.title}
              initialContent={note.content}
              submitLabel="Save Changes"
              onCancel={() => setEditing(false)}
              onSubmit={handleEditSubmit}
            />
          </div>
        ) : (
          <article className="rounded-[18px] border border-border bg-surface px-5 py-8 shadow-card transition-shadow hover:shadow-card-hover sm:px-10 sm:py-10">
            <header>
              <h1 className="break-words text-2xl font-semibold tracking-tight text-foreground">
                {note.title}
              </h1>
              <time
                dateTime={note.updatedAt}
                className="mt-2 block text-sm text-muted"
              >
                Updated {formatDateTime(note.updatedAt)}
              </time>
            </header>
            <div className="my-6 border-t border-border sm:my-7" />
            <p className="break-words whitespace-pre-wrap text-[16px] leading-[1.8] text-foreground">
              {note.content}
            </p>
            <dl className="mt-8 flex flex-col gap-5 border-t border-border pt-6 sm:mt-10 sm:flex-row sm:gap-12">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatDateTime(note.createdAt)}
                </dd>
              </div>
              
            </dl>
          </article>
        )}

        <DeleteNoteDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </AppShell>
  );
}