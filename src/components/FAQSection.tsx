"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
type FAQItem = {
  question: string
  answer: string
}
type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}
const defaultFAQs: FAQItem[] = [
  {
    question: "What makes HackSphere different from manual hackathon management?",
    answer:
      "HackSphere eliminates manual processes entirely with digital QR-based verification, automated student verification with face recognition, and structured evaluation matrices. Instead of paper lists and scattered spreadsheets, get real-time entry tracking, food management, and leaderboards. Your college gets a complete digital audit trail, prevents fraud, and reduces staffing needs by 70%.",
  },
  {
    question: "How does the QR verification system work and is it secure?",
    answer:
      "Each verified student receives a unique, dynamic QR code linked to their verified profile. Organizers scan the QR code at entry gates for instant authentication and real-time attendance logging. Our system prevents duplicate entry and food coupon fraud. All student data is encrypted end-to-end and complies with data protection standards.",
  },
  {
    question: "Can HackSphere be used for multiple events per year?",
    answer:
      "Yes! Your plan covers unlimited hackathons. Create new events anytime, customize evaluation matrices per event, and maintain separate leaderboards. All your historical data is archived for comparison and analysis. Premium plans include dedicated support to help you maximize each event.",
  },
  {
    question: "What happens if we want to integrate with our college portal?",
    answer:
      "HackSphere provides comprehensive APIs for deep integration with your college management systems. Our team can help set up SSO, automatic student roster imports, and result exports. Contact our sales team for custom integration support included in Premium plans.",
  },
]
export const FAQSection = ({ title = "Frequently asked questions", faqs = defaultFAQs }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 md:gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-tight font-normal text-foreground tracking-tight sticky top-20 sm:top-24"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-4 sm:py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-base sm:text-lg leading-6 sm:leading-7 text-foreground pr-4 sm:pr-8"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                        fontWeight: "400",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-foreground flex-shrink-0" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 sm:pb-6 pr-8 sm:pr-12">
                          <p
                            className="text-base sm:text-lg leading-6 text-muted-foreground"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
