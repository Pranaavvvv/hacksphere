"use client"

import { usePathname } from "next/navigation"

export default function FooterWrapper() {
  const pathname = usePathname()
  
  // Hide main footer on landing (now /), auth, and onboarding pages - they have their own Footer component
  if (pathname === "/" || pathname === "/auth" || pathname?.startsWith("/onboarding")) {
    return null
  }
  
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-4 text-xs text-slate-500 md:flex-row md:px-8">
        <span>
          © {new Date().getFullYear()} HackSphere. All rights reserved.
        </span>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  )
}
