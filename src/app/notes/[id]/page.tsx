"use client";

import { useParams } from "next/navigation";
import { NoteDetail } from "@/components/notes/NoteDetail";
import { RequireAuth } from "@/components/auth/RequireAuth";

function NotePageContent() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!id) {
    return null;
  }

  return <NoteDetail noteId={id} />;
}

export default function NoteDetailPage() {
  return (
    <RequireAuth>
      <NotePageContent />
    </RequireAuth>
  );
}