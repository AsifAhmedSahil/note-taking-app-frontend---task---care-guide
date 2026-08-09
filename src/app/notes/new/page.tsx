"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { createNote } from "@/lib/api";
import type { NoteInput } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function NewNoteContent() {
  const router = useRouter();
  const { token, logout } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace("/");
  };

  const handleSubmit = async (input: NoteInput): Promise<string | null> => {
    if (!token) return null;
    const result = await createNote(token, input);
    if (result.ok) {
      router.replace("/");
      return null;
    }
    if (result.status === 401) {
      logout();
      router.replace("/login");
      return null;
    }
    return result.message;
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            ← Back
          </Button>
          <h1 className="text-lg font-semibold tracking-tight text-foreground ">
            New Note
          </h1>
          <span className="w-[60px]" />
        </div>
        <NoteEditor
        
          submitLabel="Save Note"
          onCancel={handleBack}
          onSubmit={handleSubmit}
        />
      </div>
    </AppShell>
  );
}

export default function NewNotePage() {
  return (
    <RequireAuth>
      <NewNoteContent />
    </RequireAuth>
  );
}