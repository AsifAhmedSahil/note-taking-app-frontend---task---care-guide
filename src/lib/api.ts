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

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type NotesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetNotesResult =
  | { ok: true; notes: Note[]; pagination: NotesPagination }
  | { ok: false; status: number; message: string };

type NotesResponsePayload = {
  success: boolean;
  data?: Note[];
  pagination?: NotesPagination;
  message?: string;
};

export async function getNotes(
  token: string,
  page = 1,
  limit = 10
): Promise<GetNotesResult> {
  let response: Response;
  try {
    response = await fetch(`/api/notes?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Could not connect to the server. Please try again.",
    };
  }

  const payload = (await response.json().catch(() => null)) as
    | NotesResponsePayload
    | null;

  if (
    response.ok &&
    payload?.success &&
    Array.isArray(payload.data) &&
    payload.pagination
  ) {
    return { ok: true, notes: payload.data, pagination: payload.pagination };
  }

  const message =
    typeof payload?.message === "string" && payload.message.length > 0
      ? payload.message
      : "Something went wrong. Please try again.";

  return { ok: false, status: response.status, message };
}

export type NoteResult =
  | { ok: true; note: Note }
  | { ok: false; status: number; message: string };

export type NoteInput = {
  title: string;
  content: string;
};

type NoteResponsePayload = {
  success: boolean;
  note?: Note;
  message?: string;
};

async function requestNote(
  method: string,
  token: string,
  path: string,
  body?: NoteInput
): Promise<NoteResult> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Could not connect to the server. Please try again.",
    };
  }

  const payload = (await response.json().catch(() => null)) as
    | NoteResponsePayload
    | null;

  if (response.ok && payload?.success && payload.note) {
    return { ok: true, note: payload.note };
  }

  const message =
    typeof payload?.message === "string" && payload.message.length > 0
      ? payload.message
      : "Something went wrong. Please try again.";

  return { ok: false, status: response.status, message };
}

export function getNote(token: string, id: string) {
  return requestNote("GET", token, `/api/notes/${id}`);
}

export function createNote(token: string, input: NoteInput) {
  return requestNote("POST", token, "/api/notes", input);
}

export function updateNote(token: string, id: string, input: NoteInput) {
  return requestNote("PATCH", token, `/api/notes/${id}`, input);
}

export type DeleteNoteResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

type DeleteResponsePayload = {
  success: boolean;
  message?: string;
};

export async function deleteNote(
  token: string,
  id: string
): Promise<DeleteNoteResult> {
  let response: Response;
  try {
    response = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Could not connect to the server. Please try again.",
    };
  }

  const payload = (await response.json().catch(() => null)) as
    | DeleteResponsePayload
    | null;

  if (response.ok && payload?.success) {
    return { ok: true };
  }

  const message =
    typeof payload?.message === "string" && payload.message.length > 0
      ? payload.message
      : "Something went wrong. Please try again.";

  return { ok: false, status: response.status, message };
}
