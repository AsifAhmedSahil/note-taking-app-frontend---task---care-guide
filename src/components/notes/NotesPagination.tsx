import { Button } from "@/components/ui/Button";

type NotesPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function NotesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: NotesPaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <Button
        variant="secondary"
        size="md"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </Button>
      <p className="text-sm text-muted">
        Page {currentPage} of {totalPages}
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
  );
}
