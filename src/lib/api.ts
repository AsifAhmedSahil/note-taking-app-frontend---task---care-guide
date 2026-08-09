export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
};

export type AuthResult =
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; message: string };

type AuthResponsePayload = {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
};

async function postAuth(
  path: string,
  body: Record<string, unknown>
): Promise<AuthResult> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      ok: false,
      message: "Could not connect to the server. Please try again.",
    };
  }

  const payload = (await response.json().catch(() => null)) as
    | AuthResponsePayload
    | null;

  if (response.ok && payload?.success && payload.token && payload.user) {
    return { ok: true, token: payload.token, user: payload.user };
  }

  const message =
    typeof payload?.message === "string" && payload.message.length > 0
      ? payload.message
      : "Something went wrong. Please try again.";

  return { ok: false, message };
}

export function loginRequest(email: string, password: string) {
  return postAuth("/api/auth/login", { email, password });
}

export function registerRequest(
  name: string,
  email: string,
  password: string
) {
  return postAuth("/api/auth/register", {
    name,
    email,
    password,
    interests: [],
  });
}
