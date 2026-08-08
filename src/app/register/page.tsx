"use client";

import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start taking secure notes in minutes."
      footer={
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
        <Input
          id="register-name"
          label="Name"
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
        />
        <Input
          id="register-email"
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          id="register-password"
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <Input
          id="register-confirm-password"
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />
        <Button type="submit" size="lg" className="mt-1 w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
