import { Button } from "@/components/ui/Button";
import type { AdminUser, UsersPagination } from "@/lib/api";

type UsersListProps = {
  users: AdminUser[];
  pagination: UsersPagination;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        isAdmin ? "bg-accent/10 text-accent" : "bg-muted/10 text-muted"
      }`}
    >
      {role}
    </span>
  );
}

function Actions({
  user,
  onEdit,
  onDelete,
}: {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="md" onClick={() => onEdit(user)}>
        Edit
      </Button>
      <Button variant="danger" size="md" onClick={() => onDelete(user)}>
        Delete
      </Button>
    </div>
  );
}

export function UsersList({
  users,
  pagination,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
}: UsersListProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= pagination.totalPages;

  return (
    <div>
      <div className="hidden overflow-hidden rounded-surface border border-border bg-surface shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th scope="col" className="px-5 py-3 font-medium">
                Name
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Email
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Role
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Interests
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Created
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/5">
                <td className="px-5 py-3 font-medium text-foreground">
                  {user.name}
                </td>
                <td className="max-w-56 truncate px-5 py-3 text-muted">
                  {user.email}
                </td>
                <td className="px-5 py-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="max-w-40 truncate px-5 py-3 text-muted">
                  {user.interests.length > 0
                    ? user.interests.join(", ")
                    : "—"}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-muted">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" size="md" onClick={() => onEdit(user)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="md" onClick={() => onDelete(user)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-surface border border-border bg-surface p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-sm text-muted">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted">
              {user.interests.length > 0
                ? user.interests.join(", ")
                : "No interests"}
            </p>
            <p className="mt-2 text-xs text-muted">
              Created {formatDate(user.createdAt)}
            </p>
            <div className="mt-4">
              <Actions user={user} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 ? (
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