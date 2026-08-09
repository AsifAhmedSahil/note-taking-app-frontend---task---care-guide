import type { InterestGroup } from "@/lib/api";

type InterestGroupsListProps = {
  groups: InterestGroup[];
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function InterestGroupsList({ groups }: InterestGroupsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {groups.map((group) => (
        <div
          key={group.interest}
          className="rounded-[16px] border border-border bg-surface p-5 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 break-words text-base font-semibold tracking-tight text-foreground">
              {group.interest}
            </h2>
            <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {group.count} {group.count === 1 ? "user" : "users"}
            </span>
          </div>
          {group.users.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {group.users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 rounded-control border border-border bg-background/60 px-3 py-2"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                    {initials(user.name)}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No users with this interest.</p>
          )}
        </div>
      ))}
    </div>
  );
}
