"use client"

import { useEffect } from "react"
import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/ProductTeaserCard"
import { BankingScaleHero } from "@/components/BankingScaleHero"
import { CaseStudiesCarousel } from "@/components/CaseStudiesCarousel"
import { IntegrationCarousel } from "@/components/IntegrationCarousel"
import { PricingSection } from "@/components/PricingSection"
import { FAQSection } from "@/components/FAQSection"
import { Footer } from "@/components/Footer"

export default function LandingPage() {
  useEffect(() => {
    // Handle hash scrolling when navigating from other pages
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
          })
        }
      }, 300)
    }
  }, [])

  return (
    <div className="landing-theme min-h-screen">
      <PortfolioNavbar />
      <section id="home">
        <ProductTeaserCard />
      </section>
      <section id="features">
        <BankingScaleHero />
      </section>
      <section id="howitworks">
        <CaseStudiesCarousel />
      </section>
      <section id="integrations">
        <IntegrationCarousel />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="contact">
        <FAQSection />
      </section>
      <Footer />
    </div>
  )
}
