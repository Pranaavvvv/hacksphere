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
  title: "HackSphere - Complete Your Profile",
  description: "Complete your profile to get started with HackSphere",
}

export default function OnboardingLayout({
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
      {/* Onboarding page uses landing theme - isolated from main site */}
      {children}
    </div>
  )
}
