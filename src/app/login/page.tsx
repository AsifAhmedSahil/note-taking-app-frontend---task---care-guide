"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import { EMAIL_REGEX } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const result = await login(email.trim(), password);

    if (result.ok) {
      router.replace("/");
      return;
    }

    setError(result.message);
    setSubmitting(false);
  };

  return (
    <RedirectIfAuthenticated>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="login-email"
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="login-password"
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={submitting}
          >
            {submitting ? "Logging in…" : "Log in"}
          </Button>
        </form>
      </AuthCard>
    </RedirectIfAuthenticated>
  );
}
