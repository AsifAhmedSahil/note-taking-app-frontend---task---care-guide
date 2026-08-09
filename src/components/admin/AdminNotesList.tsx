import { Button } from "@/components/ui/Button";
import type { AdminNote, NotesPagination } from "@/lib/api";

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

function OwnerName({ note }: { note: AdminNote }) {
  return (
    <span className="block max-w-40 truncate font-medium text-foreground">
      {note.owner?.name ?? "Unknown"}
    </span>
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
      <div className="hidden overflow-hidden rounded-surface border border-border bg-surface shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th scope="col" className="px-5 py-3 font-medium">
                Title
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Owner
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Owner email
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-muted/5">
                <td className="max-w-72 px-5 py-3">
                  <span className="block truncate font-medium text-foreground">
                    {note.title}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-muted">
                    {note.content}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <OwnerName note={note} />
                </td>
                <td className="max-w-52 truncate px-5 py-3 text-muted">
                  {note.owner?.email ?? "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-muted">
                  {formatDate(note.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-surface border border-border bg-surface p-4 shadow-sm"
          >
            <p className="truncate text-sm font-semibold text-foreground">
              {note.title}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{note.content}</p>
            <div className="mt-3 border-t border-border pt-3">
              <p className="truncate text-sm font-medium text-foreground">
                {note.owner?.name ?? "Unknown"}
              </p>
              <p className="truncate text-sm text-muted">
                {note.owner?.email ?? "—"}
              </p>
              <p className="mt-1 text-xs text-muted">
                Created {formatDate(note.createdAt)}
              </p>
            </div>
          </div>
        ))}
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