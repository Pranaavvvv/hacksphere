"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// Base nav items - will be filtered by role
const allNavItems = [
  // Student items
  { href: "/home", label: "Home", roles: ["student", "organizer"] },
  { href: "/hackathons", label: "Hackathons", roles: ["student", "organizer"] },
  { href: "/student/verification", label: "Verification", roles: ["student"] },
  { href: "/student/pass", label: "My QR Pass", roles: ["student"] },
  // Organizer items
  { href: "/organizer/dashboard", label: "Dashboard", roles: ["organizer"] },
  { href: "/organizer/create", label: "Create Hackathon", roles: ["organizer"] },
  // Admin items
  { href: "/admin", label: "Dashboard", roles: ["admin"] },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Don't render navbar on landing page (/), auth, or onboarding - they have their own navbars
  if (pathname === "/" || pathname === "/auth" || pathname === "/onboarding") {
    return null;
  }
  
  // Get user role from localStorage
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Function to check and update user state
  const checkAuthState = () => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("hacksphere_role");
      const authToken = localStorage.getItem("hacksphere_auth_token");
      const hacksphereUser = localStorage.getItem("hacksphere_user");
      
      setUserRole(role);
      
      // Also update AuthContext user if needed
      if (authToken && hacksphereUser && !user) {
        try {
          const userData = JSON.parse(hacksphereUser);
          // Trigger AuthContext update by dispatching custom event
          window.dispatchEvent(new Event("auth-state-changed"));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  };
  
  useEffect(() => {
    checkAuthState();
  }, [user]);
  
  // Filter nav items based on role
  const filteredNavItems = allNavItems.filter((item) => {
    if (!userRole) {
      // When not logged in, show public items (Home, Hackathons)
      return item.roles.includes("student") && ["/home", "/hackathons"].includes(item.href);
    }
    return item.roles.includes(userRole);
  });
  
  // Listen for storage changes and custom auth events to update navbar when role changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthState();
    };
    
    const handleAuthStateChange = () => {
      checkAuthState();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-state-changed", handleAuthStateChange);
    // Also check on focus in case localStorage was updated in same tab
    window.addEventListener("focus", handleStorageChange);
    
    // Poll for changes every 2 seconds (fallback)
    const interval = setInterval(checkAuthState, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
      window.removeEventListener("focus", handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check if student role for centered navbar
  const isStudent = userRole === "student"

  return (
    <header className="sticky top-0 z-40 bg-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform"
          style={{
            transform: scrolled ? "scale(0.95)" : "scale(1)",
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-lg font-semibold text-white shadow-sm">
            HS
          </div>
          <div className="flex flex-col">
            <span className="text-[1.05rem] font-semibold tracking-tight text-black">
              HackSphere
            </span>
            <span className="text-[0.7rem] font-medium text-slate-500">
              Smart hackathon OS
            </span>
          </div>
        </Link>

        {/* Desktop pill navbar */}
        <div
          className={`hidden max-w-full items-center rounded-full border border-slate-200 bg-white/90 px-4 text-[0.95rem] text-slate-600 shadow-sm transition-all md:flex ${
            scrolled ? "py-1" : "py-2"
          } ${
            isStudent ? "justify-center" : "justify-between"
          }`}
          style={{
            transform: scrolled ? "scale(0.97)" : "scale(1)",
          }}
        >
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            {filteredNavItems.map((item) => {
              const active =
                item.href === "/home"
                  ? pathname === "/home"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-3 flex items-center gap-2 pl-3 border-l border-slate-200">
            {user ? (
              <>
                <span className="hidden text-xs text-slate-500 md:inline">
                  Hi, <span className="font-semibold text-slate-800">{user.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-full px-3 py-1 text-[0.8rem] font-medium hover:bg-slate-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="rounded-full px-3 py-1 text-[0.8rem] font-medium hover:bg-slate-100"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className="mr-1 text-xs">{open ? "Close" : "Menu"}</span>
          <span className="flex flex-col gap-[3px]">
            <span
              className={`h-[2px] w-4 rounded bg-slate-800 transition-transform ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-4 rounded bg-slate-800 transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-[2px] w-4 rounded bg-slate-800 transition-transform ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="mx-auto mt-1 w-full max-w-6xl px-5 pb-3 md:hidden">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-md">
            <nav className="flex flex-col gap-1">
              {filteredNavItems.map((item) => {
                const active =
                  item.href === "/home"
                    ? pathname === "/home"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2 ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-2 flex gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign in
                  </Link>
                )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

