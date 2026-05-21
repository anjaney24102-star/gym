"use client"

import { motion } from "framer-motion"
import { Instagram, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Blog", href: "#" },
  ],
  programs: [
    { name: "Strength Training", href: "#" },
    { name: "CrossFit", href: "#" },
    { name: "Yoga & Mobility", href: "#" },
    { name: "Personal Training", href: "#" },
  ],
  support: [
    { name: "Contact", href: "#contact" },
    { name: "FAQ", href: "#faq" },
    { name: "Membership", href: "#plans" },
    { name: "Schedule", href: "#" },
  ],
}

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
]

export function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="#home" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span 
                  className="text-xl font-bold text-primary-foreground"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  T
                </span>
              </div>
              <div>
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
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
              Raipur&apos;s premier fitness destination. World-class equipment, elite coaching, 
              and a community dedicated to excellence.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-6">
                Company
              </h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-6">
                Programs
              </h4>
              <ul className="space-y-4">
                {footerLinks.programs.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-6">
                Support
              </h4>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 Titan Fitness. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Terms
              </a>
              <a 
                href="#" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
