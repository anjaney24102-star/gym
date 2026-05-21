"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const transformations = [
  {
    name: "Vikram M.",
    duration: "6 months",
    weightLoss: "25 kg",
    before: "https://images.unsplash.com/photo-1616353071855-2c045c4458ae?q=80&w=400",
    after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400",
    quote: "Titan Fitness changed my life completely. The trainers pushed me beyond my limits.",
  },
  {
    name: "Anita R.",
    duration: "4 months",
    weightLoss: "15 kg",
    before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400",
    after: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=400",
    quote: "From a size XL to M! The personalized diet plan was a game-changer for me.",
  },
  {
    name: "Rahul S.",
    duration: "8 months",
    weightLoss: "30 kg",
    before: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=400",
    after: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=400",
    quote: "Never thought I could look like this. Titan Fitness made it possible!",
  },
]

export function TransformationGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % transformations.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length)

  return (
    <section id="transformations" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">Success Stories</span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            REAL <span className="text-gradient">TRANSFORMATIONS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            See the incredible transformations achieved by our members with dedication and expert guidance.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-3xl p-6 md:p-10"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Before/After Images */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                      <img
                        src={transformations[currentIndex].before}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
                        <span className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full">Before</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                      <img
                        src={transformations[currentIndex].after}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
                        <span className="text-sm font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">After</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                  <div className="flex gap-4 mb-6">
                    <div className="glass px-4 py-2 rounded-xl">
                      <span className="text-2xl font-bold text-primary">{transformations[currentIndex].weightLoss}</span>
                      <span className="text-sm text-muted-foreground block">Lost</span>
                    </div>
                    <div className="glass px-4 py-2 rounded-xl">
                      <span className="text-2xl font-bold text-primary">{transformations[currentIndex].duration}</span>
                      <span className="text-sm text-muted-foreground block">Duration</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{transformations[currentIndex].name}</h3>
                  <p className="text-muted-foreground text-lg italic mb-6">
                    &ldquo;{transformations[currentIndex].quote}&rdquo;
                  </p>

                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-fit group">
                    Start Your Transformation
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              {transformations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
