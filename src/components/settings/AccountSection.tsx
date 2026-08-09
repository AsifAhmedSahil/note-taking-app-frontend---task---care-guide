import type { ReactNode } from "react";

type AccountSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function AccountSection({
  title,
  description,
  action,
  children,
}: AccountSectionProps) {
  return (
    <section className="rounded-surface border border-border bg-surface shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {children ? <div className="px-5 py-4">{children}</div> : null}
    </section>
  );
}