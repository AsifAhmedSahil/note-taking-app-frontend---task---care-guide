import Link from "next/link";
import type { Note } from "@/lib/api";
import { getNoteColor } from "@/lib/noteColors";

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
  const color = getNoteColor(note.id);

  return (
    <Link
      href={`/notes/${note.id}`}
      style={{ backgroundColor: color.bg, borderColor: color.border }}
      className="group flex h-full flex-col gap-3 rounded-[16px] border p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 break-words text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-foreground line-clamp-2">
          {note.title}
        </h3>
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 text-foreground/40 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </div>
      <p className="line-clamp-2 flex-1 break-words text-sm leading-relaxed text-muted">
        {note.content}
      </p>
      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <time dateTime={note.createdAt} className="shrink-0 text-xs text-muted">
          {formatDate(note.createdAt)}
        </time>
      </div>
    </Link>
  );
}
