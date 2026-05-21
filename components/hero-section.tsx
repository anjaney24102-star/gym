"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat cinematic-image"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')`,
          }}
        />
        {/* Multi-layer gradient overlay for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        
        {/* Ambient red glow */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20"
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium tracking-wide uppercase text-primary bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Raipur&apos;s Premier Fitness Destination
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 
              className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight mb-2"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              <span className="block text-foreground">BUILD YOUR</span>
              <span className="block text-gradient">LEGACY</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
          >
            World-class equipment. Elite coaching. A community that pushes you beyond limits. 
            <span className="text-foreground font-medium"> Your transformation starts now.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <Link 
              href="#contact"
              className="btn-premium group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              href="/member"
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-foreground/90 hover:text-foreground transition-colors duration-300"
            >
              Member Login
              <span className="w-6 h-px bg-current transform group-hover:w-8 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-12 lg:gap-16 mt-20"
          >
            {[
              { number: "5K+", label: "Active Members" },
              { number: "50+", label: "Expert Coaches" },
              { number: "15", label: "Years of Excellence" },
            ].map((stat, index) => (
              <div key={stat.label} className="group">
                <div 
                  className="text-4xl md:text-5xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-muted-foreground tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a 
          href="#plans"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
        >
          <span className="text-xs uppercase tracking-widest">Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </a>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground [writing-mode:vertical-rl]">
          Est. 2010
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
      </div>
    </section>
  )
}
