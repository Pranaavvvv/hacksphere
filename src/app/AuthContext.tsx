"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "student" | "organizer" | "admin" | "judge";
  hackathonId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string, role: string) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error("AuthContext not initialized");
  },
  signUp: async () => {
    throw new Error("AuthContext not initialized");
  },
  signOut: () => {},
});

// ── Helper: normalize user object from API ────────────────────────
function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: (raw._id as string) || (raw.id as string) || "",
    name: (raw.name as string) || "",
    email: (raw.email as string) || "",
    role: (raw.role as User["role"]) || "student",
    hackathonId: (raw.hackathonId as string) || undefined,
  };
}

// ── Provider ──────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("hacksphere_auth_token");
      const raw = localStorage.getItem("hacksphere_user");
      if (token && raw) {
        const parsed = JSON.parse(raw);
        setUser(normalizeUser(parsed));
      }
    } catch {
      // Corrupt data — clear
      localStorage.removeItem("hacksphere_auth_token");
      localStorage.removeItem("hacksphere_user");
      localStorage.removeItem("hacksphere_role");
    }
    setLoading(false);
  }, []);

  // ── Sign In ─────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    const data = await api.post("/api/auth/login", { email, password });

    const token: string = data.token;
    const normalized = normalizeUser(data.user);

    localStorage.setItem("hacksphere_auth_token", token);
    localStorage.setItem("hacksphere_user", JSON.stringify(data.user));
    localStorage.setItem("hacksphere_role", normalized.role);
    // Legacy compat
    localStorage.setItem("hs-user", JSON.stringify(data.user));

    setUser(normalized);
    window.dispatchEvent(new Event("auth-state-changed"));

    return normalized;
  }, []);

  // ── Sign Up ─────────────────────────────────────────────────────
  const signUp = useCallback(
    async (name: string, email: string, password: string, role: string): Promise<User> => {
      const data = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      const token: string = data.token;
      const normalized = normalizeUser(data.user);

      localStorage.setItem("hacksphere_auth_token", token);
      localStorage.setItem("hacksphere_user", JSON.stringify(data.user));
      localStorage.setItem("hacksphere_role", normalized.role);
      localStorage.setItem("hs-user", JSON.stringify(data.user));

      setUser(normalized);
      window.dispatchEvent(new Event("auth-state-changed"));

      return normalized;
    },
    []
  );

  // ── Sign Out ────────────────────────────────────────────────────
  const signOut = useCallback(() => {
    localStorage.removeItem("hacksphere_auth_token");
    localStorage.removeItem("hacksphere_user");
    localStorage.removeItem("hacksphere_role");
    localStorage.removeItem("hs-user");
    setUser(null);
    window.dispatchEvent(new Event("auth-state-changed"));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
