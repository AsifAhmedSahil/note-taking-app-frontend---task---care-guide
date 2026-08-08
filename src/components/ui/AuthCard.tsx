import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Logo />
      <div className="w-full max-w-sm rounded-surface border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? (
          <div className="mt-6 border-t border-border pt-6">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
