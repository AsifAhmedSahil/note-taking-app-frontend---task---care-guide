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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    setError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    const result = await register(name.trim(), email.trim(), password);

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="register-name"
            label="Name"
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="register-email"
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="register-password"
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="register-confirm-password"
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full"
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </AuthCard>
    </RedirectIfAuthenticated>
  );
}
