"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  // Hide main navbar on landing (now /), auth, and onboarding pages - they have their own PortfolioNavbar
  if (pathname === "/" || pathname === "/auth" || pathname === "/onboarding") {
    return null
  }
  
  return <Navbar />
}
