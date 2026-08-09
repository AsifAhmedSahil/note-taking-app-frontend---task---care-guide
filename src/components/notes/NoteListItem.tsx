import Link from "next/link";
import type { Note } from "@/lib/api";

type NoteListItemProps = {
  note: Note;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function formatDate(value: string) {
  const date = new Date(value);
  const days = Math.floor((Date.now() - date.getTime()) / MS_PER_DAY);

  if (days < 1) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (days < 7) {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      -days,
      "day"
    );
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function NoteListItem({ note }: NoteListItemProps) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="group block rounded-surface border border-border bg-surface p-4 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 hover:border-accent/40"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
          {note.title}
        </h3>
        <time
          dateTime={note.createdAt}
          className="shrink-0 text-xs text-muted"
        >
          {formatDate(note.createdAt)}
        </time>
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
        {note.content}
      </p>
    </Link>
  );
}