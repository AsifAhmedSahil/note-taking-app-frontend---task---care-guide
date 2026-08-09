import { NoteListItem } from "@/components/notes/NoteListItem";
import { NotesPagination } from "@/components/notes/NotesPagination";
import type { Note, NotesPagination as Pagination } from "@/lib/api";

type NotesListProps = {
  notes: Note[];
  pagination: Pagination;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function NotesList({
  notes,
  pagination,
  currentPage,
  onPageChange,
}: NotesListProps) {
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {notes.map((note) => (
          <li key={note.id}>
            <NoteListItem note={note} />
          </li>
        ))}
      </ul>
      {pagination.totalPages > 1 ? (
        <NotesPagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
