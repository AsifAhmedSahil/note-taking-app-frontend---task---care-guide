"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { NoteInput } from "@/lib/api";

type NoteEditorProps = {
  initialTitle?: string;
  initialContent?: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (input: NoteInput) => Promise<string | null>;
};

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  submitLabel,
  onCancel,
  onSubmit,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      const submitError = await onSubmit({
        title: title.trim(),
        content,
      });
      if (submitError) {
        setError(submitError);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          autoFocus
          className="h-10 rounded-control border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-content" className="text-sm font-medium text-foreground">
          Content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          rows={14}
          className="min-h-64 resize-y rounded-control border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}