"use client"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

type FooterProps = {
  companyName?: string
  tagline?: string
  sections?: FooterSection[]
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    email?: string
  }
  copyrightText?: string
}

const defaultSections: FooterSection[] = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "#features" },
      { label: "QR Management", href: "#qr" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "#docs" },
      { label: "API Reference", href: "#api" },
    ],
  },
  {
    title: "For Organizers",
    links: [
      { label: "Getting Started", href: "#started" },
      { label: "Best Practices", href: "#practices" },
      { label: "Webinars", href: "#webinars" },
      { label: "Success Stories", href: "#stories" },
      { label: "Support", href: "#support" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#help" },
      { label: "Community", href: "#community" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Blog", href: "#blog" },
      { label: "Contact Sales", href: "#sales" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "Data Protection", href: "#data" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
]

export const Footer = ({
  companyName = "HackSphere",
  tagline = "Streamlined Hackathon Management with QR-Based Verification",
  sections = defaultSections,
  socialLinks = {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "support@hacksphere.io",
  },
  copyrightText,
}: FooterProps) => {
  const currentYear = new Date().getFullYear()
  const copyright = copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`
  return (
    <footer className="w-full bg-[#fafafa] border-t border-[#e5e5e5]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-span-2"
          >
            <div className="mb-3 sm:mb-4">
              <h3
                className="text-xl sm:text-2xl font-semibold text-[#202020] mb-1 sm:mb-2"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {companyName}
              </h3>
              <p className="text-xs sm:text-sm leading-5 text-[#666666] max-w-xs" style={{ fontFamily: "Figtree" }}>
                {tagline}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5e5] text-[#666666] hover:text-[#202020] hover:border-[#202020] transition-colors duration-150"
                  aria-label="Twitter"
                >
                  <Twitter className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5e5] text-[#666666] hover:text-[#202020] hover:border-[#202020] transition-colors duration-150"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5e5] text-[#666666] hover:text-[#202020] hover:border-[#202020] transition-colors duration-150"
                  aria-label="GitHub"
                >
                  <Github className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5e5] text-[#666666] hover:text-[#202020] hover:border-[#202020] transition-colors duration-150"
                  aria-label="Email"
                >
                  <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Link Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="col-span-1"
            >
              <h4
                className="text-xs sm:text-sm font-medium text-[#202020] mb-2 sm:mb-4 uppercase tracking-wide"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm text-[#666666] hover:text-[#202020] transition-colors duration-150"
                      style={{ fontFamily: "Figtree" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-6 sm:pt-8 border-t border-[#e5e5e5]"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-[#666666]" style={{ fontFamily: "Figtree" }}>
              {copyright}
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="#status"
                className="text-xs sm:text-sm text-[#666666] hover:text-[#202020] transition-colors duration-150"
                style={{ fontFamily: "Figtree" }}
              >
                Status
              </a>
              <a
                href="#sitemap"
                className="text-xs sm:text-sm text-[#666666] hover:text-[#202020] transition-colors duration-150"
                style={{ fontFamily: "Figtree" }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
