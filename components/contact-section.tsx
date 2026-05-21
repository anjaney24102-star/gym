"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    detail: "Near Magneto Mall, VIP Road, Raipur",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+91 98765 43210",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "hello@titanfitness.in",
  },
  {
    icon: Clock,
    title: "Hours",
    detail: "5AM - 11PM, Mon - Sun",
  },
]

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-primary">
            Get Started
          </span>
          <h2 
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Start Your
            <br />
            <span className="text-gradient">Free Trial</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Take the first step. Book your free trial session and experience 
            what sets Titan apart.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-0 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-14 bg-white/[0.03] border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-0 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tell us about your goals
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="I want to build muscle and improve my overall fitness..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="btn-premium group w-full flex items-center justify-center gap-3 h-14 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-all"
              >
                Book Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                By submitting, you agree to our terms and privacy policy.
              </p>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="group glass-card rounded-2xl p-5 hover:border-white/10 transition-all duration-300 card-lift"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {info.title}
                  </h4>
                  <p className="text-sm text-foreground">{info.detail}</p>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.8563789426145!2d81.6296!3d21.2514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDE1JzA1LjAiTiA4McKwMzcnNDYuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.3) contrast(1.2)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
