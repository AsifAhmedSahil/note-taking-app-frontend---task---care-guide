"use client";

import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your notes."
      footer={
        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
        <Input
          id="login-email"
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          id="login-password"
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        <Button type="submit" size="lg" className="mt-1 w-full">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
