import { Button } from "@/components/ui/Button";
import type { AdminNote, NotesPagination } from "@/lib/api";
import { getNoteColor } from "@/lib/noteColors";

type AdminNotesListProps = {
  notes: AdminNote[];
  pagination: NotesPagination;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function OwnerBadge({ note }: { note: AdminNote }) {
  const name = note.owner?.name ?? "Unknown";
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
        {initials(name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {name}
        </span>
        <span className="block truncate text-xs text-muted">
          {note.owner?.email ?? "—"}
        </span>
      </span>
    </div>
  );
}

export function AdminNotesList({
  notes,
  pagination,
  currentPage,
  onPageChange,
}: AdminNotesListProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= pagination.totalPages;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note) => {
          const color = getNoteColor(note.id);
          return (
            <div
              key={note.id}
              style={{ backgroundColor: color.bg, borderColor: color.border }}
              className="flex flex-col gap-3 rounded-[16px] border p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <h2 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground">
                {note.title}
              </h2>
              <p className="line-clamp-3 flex-1 break-words text-sm leading-relaxed text-muted">
                {note.content}
              </p>
              <div className="border-t border-border/60 pt-3">
                <OwnerBadge note={note} />
                <p className="mt-2 text-xs text-muted">
                  Created {formatDate(note.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {pagination.totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Button
            variant="secondary"
            size="md"
            disabled={isFirst}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← Previous
          </Button>
          <p className="text-sm text-muted">
            Page {currentPage} of {pagination.totalPages}
          </p>
          <Button
            variant="secondary"
            size="md"
            disabled={isLast}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next →
          </Button>
        </div>
      ) : null}
    </div>
  );
}
