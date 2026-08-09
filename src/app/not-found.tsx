import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Logo />
      <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-surface border border-border bg-surface p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          404
        </h1>
        <p className="text-base font-semibold text-foreground">Page not found</p>
        <p className="text-sm text-muted">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex h-9 items-center justify-center rounded-control bg-accent px-4 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
