"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const checkAndSetUser = () => {
    if (typeof window === "undefined") return;
    
    // Check for hacksphere_user (from auth page) or hs-user (legacy)
    const hacksphereUser = window.localStorage.getItem("hacksphere_user");
    const legacyUser = window.localStorage.getItem("hs-user");
    const authToken = window.localStorage.getItem("hacksphere_auth_token");
    
    if (hacksphereUser && authToken) {
      try {
        const userData = JSON.parse(hacksphereUser);
        // Extract name and email from userData
        const user: User = {
          name: userData.name || userData.email?.split("@")[0] || "User",
          email: userData.email || "",
        };
        setUser(user);
        // Also sync to hs-user for compatibility
        window.localStorage.setItem("hs-user", JSON.stringify(user));
      } catch {
        window.localStorage.removeItem("hacksphere_user");
      }
    } else if (legacyUser) {
      try {
        setUser(JSON.parse(legacyUser));
      } catch {
        window.localStorage.removeItem("hs-user");
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAndSetUser();
    
    // Listen for auth state changes
    const handleAuthStateChange = () => {
      checkAndSetUser();
    };
    
    window.addEventListener("auth-state-changed", handleAuthStateChange);
    window.addEventListener("storage", handleAuthStateChange);
    
    // Poll for changes every 2 seconds (fallback)
    const interval = setInterval(checkAndSetUser, 2000);
    
    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
      window.removeEventListener("storage", handleAuthStateChange);
      clearInterval(interval);
    };
  }, []);

  const signIn = (u: User) => {
    setUser(u);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("hs-user", JSON.stringify(u));
      // Also sync to hacksphere_user for compatibility
      const hacksphereUser = {
        name: u.name,
        email: u.email,
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem("hacksphere_user", JSON.stringify(hacksphereUser));
      window.localStorage.setItem("hacksphere_auth_token", "temp_token_" + Date.now());
    }
  };

  const signOut = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("hs-user");
      window.localStorage.removeItem("hacksphere_user");
      window.localStorage.removeItem("hacksphere_auth_token");
      window.localStorage.removeItem("hacksphere_role");
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

