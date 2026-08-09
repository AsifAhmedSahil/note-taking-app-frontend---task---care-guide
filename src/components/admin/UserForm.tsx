"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EMAIL_REGEX } from "@/lib/api";
import type { AdminUser, UserInput } from "@/lib/api";

type UserFormProps = {
  mode: "create" | "edit";
  user?: AdminUser;
  onCancel: () => void;
  onSubmit: (input: UserInput) => Promise<string | null>;
};

const selectStyles =
  "h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function UserForm({ mode, user, onCancel, onSubmit }: UserFormProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">(
    user?.role === "admin" ? "admin" : "user"
  );
  const [interests, setInterests] = useState(user?.interests?.join(", ") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode === "create" && !password) {
      setError("Password is required.");
      return;
    }
    if (role !== "user" && role !== "admin") {
      setError("Role must be either user or admin.");
      return;
    }

    const input: UserInput = {
      name: name.trim(),
      email: email.trim(),
      role,
      interests: interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    if (password) {
      input.password = password;
    }

    setSubmitting(true);
    try {
      const submitError = await onSubmit(input);
      if (submitError) {
        setError(submitError);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="user-name"
          label="Name"
          type="text"
          placeholder="Full name"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-role" className="text-sm font-medium text-foreground">
            Role
          </label>
          <select
            id="user-role"
            className={selectStyles}
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>

      <Input
        id="user-email"
        label="Email"
        type="email"
        placeholder="user@example.com"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        id="user-password"
        label={mode === "create" ? "Password" : "Password (leave blank to keep current)"}
        type="password"
        placeholder={mode === "create" ? "Enter a password" : "Enter a new password"}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        id="user-interests"
        label="Interests (comma separated)"
        type="text"
        placeholder="reading, hiking, music"
        autoComplete="off"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Create User" : "Save Changes"}
        </Button>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}