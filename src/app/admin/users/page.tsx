"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { UsersList } from "@/components/admin/UsersList";
import { UserForm } from "@/components/admin/UserForm";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import { RequireAuth } from "@/components/auth/RequireAuth";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api";
import type {
  AdminUser,
  UserInput,
  UsersPagination,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { IconPlus } from "@/components/icons";

const PAGE_SIZE = 10;

type ViewState =
  | { kind: "loading" }
  | { kind: "list" }
  | { kind: "accessDenied" }
  | { kind: "error"; message: string };

type FormState = { mode: "create" } | { mode: "edit"; user: AdminUser } | null;

function AdminUsersContent() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [view, setView] = useState<ViewState>({ kind: "loading" });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<UsersPagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState<FormState>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const handleUnauthorized = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace("/");
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getUsers(token, page, PAGE_SIZE)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setUsers(result.users);
          setPagination(result.pagination);
          setView({ kind: "list" });
        } else if (result.status === 401) {
          handleUnauthorized();
        } else if (result.status === 403) {
          setView({ kind: "accessDenied" });
        } else {
          setView({ kind: "error", message: result.message });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setView({
            kind: "error",
            message: "Something went wrong. Please try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, page, reloadKey, handleUnauthorized]);

  const refresh = () => setReloadKey((key) => key + 1);

  const retry = () => {
    setView({ kind: "loading" });
    setReloadKey((key) => key + 1);
  };

  const handlePageChange = (nextPage: number) => {
    setView({ kind: "loading" });
    setPage(nextPage);
  };

  const handleFormSubmit = async (input: UserInput): Promise<string | null> => {
    if (!token || !form) return null;

    if (form.mode === "edit") {
      const result = await updateUser(token, form.user.id, input);
      if (result.ok) {
        setForm(null);
        refresh();
        return null;
      }
      if (result.status === 401) {
        handleUnauthorized();
        return null;
      }
      if (result.status === 403) {
        setForm(null);
        setView({ kind: "accessDenied" });
        return null;
      }
      return result.message;
    }

    const result = await createUser(token, input);
    if (result.ok) {
      setForm(null);
      setPage(1);
      refresh();
      return null;
    }
    if (result.status === 401) {
      handleUnauthorized();
      return null;
    }
    if (result.status === 403) {
      setForm(null);
      setView({ kind: "accessDenied" });
      return null;
    }
    return result.message;
  };

  const handleDeleteConfirm = async (): Promise<string | null> => {
    if (!token || !deleteTarget) return null;

    const result = await deleteUser(token, deleteTarget.id);
    if (result.ok) {
      setDeleteTarget(null);
      if (users.length === 1 && page > 1) {
        setView({ kind: "loading" });
        setPage(page - 1);
      } else {
        refresh();
      }
      return null;
    }
    if (result.status === 401) {
      handleUnauthorized();
      return null;
    }
    if (result.status === 403) {
      setDeleteTarget(null);
      setView({ kind: "accessDenied" });
      return null;
    }
    return result.message;
  };

  if (view.kind === "loading") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted">Loading users...</p>
        </div>
      </AppShell>
    );
  }

  if (view.kind === "accessDenied") {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Access denied
          </h2>
          <p className="text-sm text-muted">
            You do not have permission to view this page.
          </p>
          <Button variant="secondary" className="mt-2" onClick={handleBack}>
            Back
          </Button>
        </div>
      </AppShell>
    );
  }

  if (view.kind === "error") {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted">{view.message}</p>
            <Button variant="secondary" onClick={() => retry()}>
              Try again
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
        {form ? (
          <>
            <Button variant="ghost" onClick={() => setForm(null)}>
              ← Users
            </Button>
            <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
              {form.mode === "create" ? "Create User" : "Edit User"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {form.mode === "create"
                ? "Add a new user account."
                : `Update ${form.user.name}'s account.`}
            </p>
            <div className="mt-6 rounded-surface border border-border bg-surface p-5 shadow-sm">
              <UserForm
                mode={form.mode}
                user={form.mode === "edit" ? form.user : undefined}
                onCancel={() => setForm(null)}
                onSubmit={handleFormSubmit}
              />
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={handleBack}>
              ← Back
            </Button>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Users
                </h1>
                <p className="mt-1 text-sm text-muted">Manage application users</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted">
                  {pagination.total} {pagination.total === 1 ? "user" : "users"}
                </p>
                <Button onClick={() => setForm({ mode: "create" })}>
                  <IconPlus className="h-4 w-4" />
                  Create User
                </Button>
              </div>
            </div>
            <div className="mt-6">
              <UsersList
                users={users}
                pagination={pagination}
                currentPage={page}
                onPageChange={handlePageChange}
                onEdit={(user) => setForm({ mode: "edit", user })}
                onDelete={setDeleteTarget}
              />
            </div>
          </>
        )}
      </div>

      <DeleteUserDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AppShell>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireAuth>
      <AdminUsersContent />
    </RequireAuth>
  );
}