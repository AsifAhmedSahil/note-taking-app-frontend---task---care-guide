"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconClose, IconSearch } from "@/components/icons";

const DEBOUNCE_MS = 350;

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") ?? "";
  const timerRef = useRef<number | null>(null);

  const [value, setValue] = useState(urlQuery);
  const [lastUrl, setLastUrl] = useState(urlQuery);

  if (lastUrl !== urlQuery) {
    setLastUrl(urlQuery);
    setValue(urlQuery);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const applyToUrl = (next: string) => {
    const trimmed = next.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => applyToUrl(next), DEBOUNCE_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      applyToUrl(value);
    }
  };

  const handleClear = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    setValue("");
    applyToUrl("");
  };

  return (
    <div className="relative hidden sm:block">
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        role="searchbox"
        aria-label="Search notes"
        placeholder="Search notes"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-9 w-56 rounded-control border border-border bg-background pl-9 pr-9 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-muted/10 hover:text-foreground"
        >
          <IconClose className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}