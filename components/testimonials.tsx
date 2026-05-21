"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Arun Verma",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    rating: 5,
    text: "Titan Fitness transformed my approach to health. Lost 20kgs in 6 months with their expert guidance. The atmosphere is incredibly motivating.",
    highlight: "Lost 20kgs",
  },
  {
    name: "Meera Joshi",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    rating: 5,
    text: "As a working professional, flexibility is key. The Elite plan&apos;s 24/7 access fits my schedule perfectly. Personal trainers here are exceptional.",
    highlight: "24/7 access",
  },
  {
    name: "Karan Thakur",
    role: "College Student",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    rating: 5,
    text: "Best decision I made for my fitness journey. The group classes are energetic and the community is incredibly supportive.",
    highlight: "Great community",
  },
  {
    name: "Sunita Devi",
    role: "Fitness Enthusiast",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    rating: 5,
    text: "I was hesitant at first, but Titan has a welcoming environment for everyone. The yoga sessions are therapeutic and trainers truly understand individual needs.",
    highlight: "Welcoming",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [])

  const navigate = (direction: "next" | "prev") => {
    stopAutoPlay()
    if (direction === "next") {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    } else {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
    startAutoPlay()
  }

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            Testimonials
          </span>
          <h2 
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Real <span className="text-gradient">Results</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Quote mark decoration */}
              <div className="absolute -top-8 -left-4 text-[120px] font-serif text-primary/10 leading-none select-none">
                &ldquo;
              </div>
              
              <div className="relative glass-card rounded-3xl p-8 md:p-12 lg:p-16">
                {/* Stars */}
                <div className="flex gap-1 mb-8">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground/90 mb-10">
                  {testimonials[currentIndex].text}
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/30">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 
                        className="font-semibold text-lg"
                        style={{ fontFamily: "var(--font-oswald)" }}
                      >
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Highlight badge */}
                  <span className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full">
                    {testimonials[currentIndex].highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    stopAutoPlay()
                    setCurrentIndex(index)
                    startAutoPlay()
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "w-8 bg-primary" 
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("prev")}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("next")}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-300"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
