"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "1,499",
    period: "month",
    description: "Begin your transformation",
    features: [
      "Full gym floor access",
      "Basic equipment usage",
      "Locker room access",
      "1 fitness assessment",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "2,999",
    period: "month",
    description: "For committed athletes",
    features: [
      "Everything in Starter",
      "All group classes",
      "Personal trainer (2x/month)",
      "Nutrition guidance",
      "Sauna & steam room",
      "2 guest passes/month",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "4,999",
    period: "month",
    description: "The ultimate experience",
    features: [
      "Everything in Pro",
      "Unlimited PT sessions",
      "Custom meal plans",
      "Priority booking",
      "24/7 access",
      "Spa & recovery zone",
      "Exclusive merchandise",
    ],
    popular: false,
  },
]

export function MembershipPlans() {
  return (
    <section id="plans" className="py-32 relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      
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
            Membership
          </span>
          <h2 
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Choose Your
            <br />
            <span className="text-gradient">Path</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Flexible plans designed to match your commitment level. 
            No contracts, cancel anytime.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`group relative rounded-2xl p-8 lg:p-10 transition-all duration-500 ${
                plan.popular 
                  ? "glass-card border-primary/30 red-glow-subtle" 
                  : "glass-card hover:border-white/10"
              } card-lift`}
            >
              {plan.popular && (
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 
                    className="text-xl font-semibold"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-white/5">
                <span className="text-lg text-muted-foreground">₹</span>
                <span 
                  className="text-5xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {plan.price}
                </span>
                <span className="text-muted-foreground">/mo</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                    }`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="#contact"
                className={`group/btn w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10"
                }`}
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>No joining fee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>7-day free trial</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
