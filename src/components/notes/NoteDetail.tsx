"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { getNote, updateNote, deleteNote } from "@/lib/api";
import type { Note, NoteInput } from "@/lib/api";
import { useAuth } from "@/lib/auth";

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
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
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
            className="mt-2"
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
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={handleBack}>
            ← Back
          </Button>
          {editing ? (
            <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Editing note
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
              <Button onClick={() => setEditing(true)}>Edit</Button>
            </div>
          )}
        </div>

        {editing ? (
          <NoteEditor
            initialTitle={note.title}
            initialContent={note.content}
            submitLabel="Save Changes"
            onCancel={() => setEditing(false)}
            onSubmit={handleEditSubmit}
          />
        ) : (
          <article>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {note.title}
            </h1>
            <time
              dateTime={note.updatedAt}
              className="mt-1.5 block text-xs text-muted"
            >
              Updated{" "}
              {new Date(note.updatedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </time>
            <div className="mt-6 border-b border-border" />
            <p className="mt-6 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
              {note.content}
            </p>
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