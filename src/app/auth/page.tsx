"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { Footer } from "@/components/Footer"

type UserRole = "admin" | "student" | "organizer"
type AuthMode = "login" | "signup"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [role, setRole] = useState<UserRole | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!role) {
      setError("Please select a role")
      setLoading(false)
      return
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters")
        setLoading(false)
        return
      }
      if (!name.trim()) {
        setError("Name is required")
        setLoading(false)
        return
      }

      // Simulate signup - store user data
      const userData = {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("hacksphere_user", JSON.stringify(userData))
      localStorage.setItem("hacksphere_auth_token", "temp_token_" + Date.now())

      // Redirect to onboarding
      router.push(`/onboarding?role=${role}`)
    } else {
      // Simulate login
      if (!email || !password) {
        setError("Email and password are required")
        setLoading(false)
        return
      }

      localStorage.setItem("hacksphere_auth_token", "temp_token_" + Date.now())
      localStorage.setItem("hacksphere_role", role)
      
      // Also sync user data for AuthContext
      const userData = {
        email,
        name: email.split("@")[0] || "User",
        role,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("hacksphere_user", JSON.stringify(userData))
      
      // Also sync to hs-user for AuthContext compatibility
      const authUser = {
        name: userData.name,
        email: userData.email,
      }
      localStorage.setItem("hs-user", JSON.stringify(authUser))
      
      // Dispatch custom event to notify AuthContext
      window.dispatchEvent(new Event("auth-state-changed"))

      // Redirect based on role
      const redirects: Record<UserRole, string> = {
        admin: "/admin",
        student: "/home",
        organizer: "/organizer/dashboard",
      }
      
      // Small delay to ensure localStorage is set before redirect
      setTimeout(() => {
        router.push(redirects[role])
        // Trigger auth state update
        window.dispatchEvent(new Event("auth-state-changed"))
      }, 50)
    }

    setLoading(false)
  }

  return (
    <>
      <PortfolioNavbar />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Join HackSphere"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Sign in to manage your hackathon"
                : "Create an account to get started"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["admin", "student", "organizer"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      role === r
                        ? "bg-primary text-white"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field - Signup Only */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min 8 characters" : "••••••••"}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Confirm Password - Signup Only */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading
                  ? "Loading..."
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login")
                    setError("")
                    setName("")
                    setEmail("")
                    setPassword("")
                    setConfirmPassword("")
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong>Demo:</strong> Use any email and password to test the authentication flow.
              You'll be redirected to your role-specific dashboard.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
