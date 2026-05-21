"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BMICategory = {
  label: string
  range: string
  color: string
  advice: string
}

const bmiCategories: BMICategory[] = [
  { label: "Underweight", range: "< 18.5", color: "text-blue-400", advice: "Consider consulting a nutritionist for a healthy weight gain plan." },
  { label: "Normal", range: "18.5 - 24.9", color: "text-green-400", advice: "Great job! Maintain your healthy lifestyle with regular exercise." },
  { label: "Overweight", range: "25 - 29.9", color: "text-yellow-400", advice: "Consider increasing physical activity and monitoring your diet." },
  { label: "Obese", range: "≥ 30", color: "text-red-400", advice: "We recommend consulting with our fitness experts for a personalized plan." },
]

export function BMICalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState<BMICategory | null>(null)

  const calculateBMI = () => {
    const h = parseFloat(height) / 100 // Convert cm to m
    const w = parseFloat(weight)

    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h)
      setBmi(Math.round(bmiValue * 10) / 10)

      if (bmiValue < 18.5) {
        setCategory(bmiCategories[0])
      } else if (bmiValue < 25) {
        setCategory(bmiCategories[1])
      } else if (bmiValue < 30) {
        setCategory(bmiCategories[2])
      } else {
        setCategory(bmiCategories[3])
      }
    }
  }

  const reset = () => {
    setHeight("")
    setWeight("")
    setBmi(null)
    setCategory(null)
  }

  return (
    <section id="bmi" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">Health Check</span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            BMI <span className="text-gradient">CALCULATOR</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Calculate your Body Mass Index to understand your current fitness level and get personalized recommendations.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-12">
              {/* Calculator Form */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Calculate Your BMI</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="height" className="text-sm font-medium mb-2 block">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-input border-border rounded-xl h-12 text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium mb-2 block">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-input border-border rounded-xl h-12 text-lg"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={calculateBMI}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-lg font-semibold"
                    >
                      Calculate BMI
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      className="rounded-xl h-12 px-6 border-border hover:border-primary"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="flex flex-col justify-center">
                {bmi !== null && category ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="text-7xl font-bold mb-2">{bmi}</div>
                    <div className={`text-2xl font-semibold mb-4 ${category.color}`}>
                      {category.label}
                    </div>
                    <div className="glass rounded-xl p-4 flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground text-sm text-left">
                        {category.advice}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-muted-foreground/30 mb-4">--</div>
                    <p className="text-muted-foreground">
                      Enter your height and weight to calculate your BMI
                    </p>
                  </div>
                )}

                {/* BMI Scale */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="text-sm font-semibold mb-4 text-muted-foreground">BMI Categories</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {bmiCategories.map((cat) => (
                      <div key={cat.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cat.color.replace('text-', 'bg-')}`} />
                        <span className="text-sm text-muted-foreground">
                          {cat.label}: {cat.range}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
