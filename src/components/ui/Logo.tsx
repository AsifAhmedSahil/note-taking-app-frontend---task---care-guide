import { IconNote } from "@/components/icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <IconNote className="h-4 w-4" />
      </div>
      <span className="text-base font-semibold tracking-tight text-foreground">
        Secure Notes
      </span>
    </div>
  );
}
