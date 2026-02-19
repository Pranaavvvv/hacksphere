import type { Metadata } from "next"
import { Figtree, Inter, Geist_Mono } from "next/font/google"
import "./landing-theme.css"

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
  title: "HackSphere - College Hackathon Management Platform",
  description: "Streamlined hackathon management with QR-based verification, student verification, PPT evaluation, and real-time scoring for colleges",
}

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div 
      className={`landing-theme ${inter.variable} ${figtree.variable} ${geistMono.variable} min-h-screen`}
      style={{
        // Ensure landing theme variables are scoped to this container
        isolation: "isolate",
      }}
    >
      {/* Landing page uses its own theme and navbar - isolated from main site */}
      {/* Main site navbar and footer are hidden via NavbarWrapper and FooterWrapper */}
      {children}
    </div>
  )
}
