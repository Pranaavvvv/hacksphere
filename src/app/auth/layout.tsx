import type { Metadata } from "next"
import { Figtree, Inter, Geist_Mono } from "next/font/google"
import "../landing/landing-theme.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "HackSphere - Sign In / Sign Up",
  description: "Sign in or create an account to access HackSphere",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div 
      className={`landing-theme ${inter.variable} ${figtree.variable} ${geistMono.variable} min-h-screen`}
      style={{
        isolation: "isolate",
      }}
    >
      {/* Auth page uses landing theme and PortfolioNavbar - isolated from main site */}
      {children}
    </div>
  )
}
