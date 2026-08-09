"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type DeleteNoteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<string | null>;
};

export function DeleteNoteDialog({
  open,
  onClose,
  onConfirm,
}: DeleteNoteDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!deleting) {
          setError(null);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, deleting, onClose]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (deleting) return;
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (deleting) return;
    setError(null);
    setDeleting(true);
    const deleteError = await onConfirm();
    if (deleteError) {
      setError(deleteError);
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-note-title"
      aria-describedby="delete-note-description"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-sm rounded-surface border border-border bg-surface p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-note-title"
          className="text-base font-semibold text-foreground"
        >
          Delete note?
        </h2>
        <p id="delete-note-description" className="mt-2 text-sm text-muted">
          This action cannot be undone.
        </p>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            ref={cancelRef}
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}