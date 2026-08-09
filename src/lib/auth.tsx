"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
} from "react";
import { loginRequest, registerRequest } from "@/lib/api";
import type { AuthUser } from "@/lib/api";

const TOKEN_KEY = "secure-notes-token";
const USER_KEY = "secure-notes-user";

type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; token: string; user: AuthUser }
  | { status: "unauthenticated" };

const LOADING_STATE: AuthState = { status: "loading" };

let cachedRaw: string | null = null;
let cachedState: AuthState = { status: "unauthenticated" };

const sessionListeners = new Set<() => void>();

function getSnapshot(): AuthState {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const user = window.localStorage.getItem(USER_KEY);
  const raw = `${token}\u0000${user}`;

  if (raw === cachedRaw) {
    return cachedState;
  }

  cachedRaw = raw;

  if (token && user) {
    try {
      cachedState = {
        status: "authenticated",
        token,
        user: JSON.parse(user) as AuthUser,
      };
      return cachedState;
    } catch {
      cachedState = { status: "unauthenticated" };
      return cachedState;
    }
  }

  cachedState = { status: "unauthenticated" };
  return cachedState;
}

function subscribeSession(onStoreChange: () => void) {
  sessionListeners.add(onStoreChange);
  return () => {
    sessionListeners.delete(onStoreChange);
  };
}

function notifySession() {
  sessionListeners.forEach((listener) => listener());
}

type AuthResult = { ok: true } | { ok: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useSyncExternalStore(
    subscribeSession,
    getSnapshot,
    () => LOADING_STATE
  );

  const setSession = (token: string, user: AuthUser) => {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    notifySession();
  };

  const clearSession = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    notifySession();
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const result = await loginRequest(email, password);
    if (result.ok) {
      setSession(result.token, result.user);
      return { ok: true };
    }
    return { ok: false, message: result.message };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    const result = await registerRequest(name, email, password);
    if (result.ok) {
      setSession(result.token, result.user);
      return { ok: true };
    }
    return { ok: false, message: result.message };
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.status === "authenticated" ? authState.user : null,
        token: authState.status === "authenticated" ? authState.token : null,
        isAuthenticated: authState.status === "authenticated",
        isLoading: authState.status === "loading",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
