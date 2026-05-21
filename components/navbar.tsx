"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Programs", href: "#plans" },
  { name: "Coaches", href: "#trainers" },
  { name: "Results", href: "#transformations" },
  { name: "Reviews", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "py-3" 
            : "py-6"
        }`}
      >
        {/* Background blur layer */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ${
            isScrolled 
              ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.04]" 
              : "bg-transparent"
          }`}
        />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="#home" className="group flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl font-bold text-primary-foreground" style={{ fontFamily: "var(--font-oswald)" }}>T</span>
                </div>
                <div className="absolute inset-0 bg-primary/40 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <span 
                  className="text-lg font-semibold tracking-tight text-foreground"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  TITAN
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">
                  Fitness
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/member"
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                href="#contact"
                className="btn-premium relative px-5 py-2.5 text-[13px] font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-10 w-10 h-10 flex items-center justify-center text-foreground"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="glass rounded-2xl p-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all duration-300"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                  <Link
                    href="/member"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-xl text-center hover:bg-primary/90 transition-colors"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
