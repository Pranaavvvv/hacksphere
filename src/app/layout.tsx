import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";
import "./landing/landing-theme.css";
import NavbarWrapper from "./NavbarWrapper";
import FooterWrapper from "./FooterWrapper";
import { AuthProvider } from "./AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HackSphere | Smart Hackathon Platform",
  description:
    "Modern hackathon management platform with student verification, QR-based entry & meals, live evaluation dashboards, and admin controls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${figtree.variable} antialiased bg-slate-50 text-slate-900 overflow-x-hidden`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* Navbar is conditionally rendered - excluded for landing page (/) */}
            <NavbarWrapper />

            <main className="flex-1 bg-slate-50">{children}</main>

            {/* Footer is conditionally rendered - excluded for landing page (/) */}
            <FooterWrapper />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
