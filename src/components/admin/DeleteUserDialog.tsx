"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type DeleteUserDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<string | null>;
};

export function DeleteUserDialog({
  open,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete user?"
      description="This action cannot be undone."
      confirmLabel="Delete"
      busyLabel="Deleting…"
    />
  );
}