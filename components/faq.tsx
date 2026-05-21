"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What are the gym timings?",
    answer: "Our gym operates from 5:00 AM to 11:00 PM on weekdays and 6:00 AM to 10:00 PM on weekends. Elite members have 24/7 access with their key card.",
  },
  {
    question: "Do you offer personal training?",
    answer: "Yes! We have 50+ certified personal trainers available. Personal training sessions are included in our Pro and Elite plans, or can be purchased separately for Starter members.",
  },
  {
    question: "Is there a joining fee?",
    answer: "There is a one-time registration fee of ₹500 which includes your membership card, fitness assessment, and gym orientation session.",
  },
  {
    question: "Can I freeze my membership?",
    answer: "Yes, you can freeze your membership for up to 2 months per year in case of medical reasons or travel. Elite members can freeze for up to 3 months.",
  },
  {
    question: "What group classes do you offer?",
    answer: "We offer a variety of classes including Yoga, Zumba, HIIT, CrossFit, Spinning, Kickboxing, and Aerobics. Classes are included in Pro and Elite memberships.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, we have free parking for all members. Our facility includes both two-wheeler and four-wheeler parking spaces with 24/7 security.",
  },
  {
    question: "Do you have separate sections for women?",
    answer: "Yes, we have a dedicated women-only workout zone with all essential equipment, ensuring a comfortable environment for our female members.",
  },
  {
    question: "Can I get a trial before joining?",
    answer: "Absolutely! We offer a free 3-day trial pass for first-time visitors. Just bring a valid ID and come experience Titan Fitness yourself.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">Support</span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            FREQUENTLY ASKED <span className="text-gradient">QUESTIONS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Got questions? We have answers. If you can&apos;t find what you&apos;re looking for, feel free to contact us.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full glass-card rounded-2xl p-6 text-left transition-all ${
                  openIndex === index ? "border-primary/50" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-primary shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground mt-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
