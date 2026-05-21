"use client"

import { motion } from "framer-motion"
import { Instagram, ArrowUpRight } from "lucide-react"
import Image from "next/image"

const trainers = [
  {
    name: "Rajesh Kumar",
    specialty: "Strength & Conditioning",
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600",
    instagram: "@rajesh_fitness",
  },
  {
    name: "Priya Sharma",
    specialty: "Yoga & Flexibility",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600",
    instagram: "@priya_yoga",
  },
  {
    name: "Amit Singh",
    specialty: "CrossFit & HIIT",
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600",
    instagram: "@amit_crossfit",
  },
  {
    name: "Sneha Patel",
    specialty: "Nutrition & Wellness",
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1609899464726-209befafa5d0?q=80&w=600",
    instagram: "@sneha_nutrition",
  },
]

export function TrainerCards() {
  return (
    <section id="trainers" className="py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
        >
          <div className="max-w-xl">
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Our Coaches
            </span>
            <h2 
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Meet the
              <br />
              <span className="text-gradient">Experts</span>
            </h2>
          </div>
          <p className="text-muted-foreground lg:max-w-sm text-lg leading-relaxed">
            Certified professionals dedicated to pushing you beyond your limits.
          </p>
        </motion.div>

        {/* Trainers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                {/* Image */}
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 cinematic-image"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 
                        className="text-xl font-semibold text-foreground mb-1"
                        style={{ fontFamily: "var(--font-oswald)" }}
                      >
                        {trainer.name}
                      </h3>
                      <p className="text-sm text-primary font-medium">{trainer.specialty}</p>
                      <p className="text-xs text-muted-foreground mt-2">{trainer.experience} experience</p>
                    </div>
                    
                    {/* Instagram link */}
                    <a 
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                      aria-label={`Follow ${trainer.name} on Instagram`}
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Top corner decoration */}
                <div className="absolute top-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                    {trainer.instagram}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
          >
            Book a session with our coaches
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
