import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { IconNote, IconPlus } from "@/components/icons";

export default function HomePage() {
  return (
    <RequireAuth>
      <AppShell>
        <EmptyState
          icon={<IconNote className="h-6 w-6 text-muted" />}
          title="No notes yet"
          description="Create your first note to get started."
          action={
            <Button>
              <IconPlus className="h-4 w-4" />
              New Note
            </Button>
          }
        />
      </AppShell>
    </RequireAuth>
  );
}
