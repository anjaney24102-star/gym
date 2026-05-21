"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, Info } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BMIResult {
  bmi: number
  category: string
  color: string
  description: string
  recommendation: string
}

function calculateBMI(weight: number, height: number): BMIResult {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  
  let category: string
  let color: string
  let description: string
  let recommendation: string

  if (bmi < 18.5) {
    category = "Underweight"
    color = "text-blue-500"
    description = "Your BMI indicates you are underweight."
    recommendation = "Consider consulting a nutritionist to create a healthy weight gain plan with adequate protein and calories."
  } else if (bmi < 25) {
    category = "Normal"
    color = "text-green-500"
    description = "Your BMI is within the healthy range."
    recommendation = "Maintain your current lifestyle with regular exercise and balanced nutrition."
  } else if (bmi < 30) {
    category = "Overweight"
    color = "text-yellow-500"
    description = "Your BMI indicates you are overweight."
    recommendation = "Focus on creating a caloric deficit through cardio and strength training, combined with a balanced diet."
  } else {
    category = "Obese"
    color = "text-red-500"
    description = "Your BMI indicates obesity."
    recommendation = "We recommend consulting with our trainers for a personalized weight loss program."
  }

  return { bmi: Math.round(bmi * 10) / 10, category, color, description, recommendation }
}

const bmiRanges = [
  { range: "< 18.5", category: "Underweight", color: "bg-blue-500" },
  { range: "18.5 - 24.9", category: "Normal", color: "bg-green-500" },
  { range: "25 - 29.9", category: "Overweight", color: "bg-yellow-500" },
  { range: "≥ 30", category: "Obese", color: "bg-red-500" },
]

export default function BMICalculator() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [gender, setGender] = useState("male")
  const [result, setResult] = useState<BMIResult | null>(null)

  const handleCalculate = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    
    if (w > 0 && h > 0) {
      setResult(calculateBMI(w, h))
    }
  }

  const handleReset = () => {
    setWeight("")
    setHeight("")
    setGender("male")
    setResult(null)
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="BMI Calculator" 
        subtitle="Calculate your Body Mass Index"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Calculate Your BMI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-foreground">Gender</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-muted-foreground cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-muted-foreground cursor-pointer">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-foreground">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height" className="text-foreground">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="e.g., 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleCalculate} className="flex-1">
                    Calculate BMI
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {result ? (
              <Card className="glass-card border-border h-full">
                <CardHeader>
                  <CardTitle className="text-foreground">Your Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-40 h-40 rounded-full border-8 border-primary mx-auto flex flex-col items-center justify-center"
                    >
                      <span className="text-4xl font-bold text-foreground">{result.bmi}</span>
                      <span className="text-sm text-muted-foreground">BMI</span>
                    </motion.div>
                    <Badge className={`mt-4 ${result.color.replace("text-", "bg-")}/20 ${result.color}`}>
                      {result.category}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Recommendation</p>
                          <p className="text-sm text-muted-foreground mt-1">{result.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-border h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Enter your details to calculate BMI</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* BMI Chart Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">BMI Categories Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bmiRanges.map((range, index) => (
                  <motion.div
                    key={range.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/30 text-center"
                  >
                    <div className={`w-4 h-4 rounded-full ${range.color} mx-auto mb-2`} />
                    <p className="font-semibold text-foreground">{range.category}</p>
                    <p className="text-sm text-muted-foreground mt-1">{range.range}</p>
                  </motion.div>
                ))}
              </div>

              {/* Visual BMI Scale */}
              <div className="mt-6">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div className="w-1/4 bg-blue-500" />
                  <div className="w-1/4 bg-green-500" />
                  <div className="w-1/4 bg-yellow-500" />
                  <div className="w-1/4 bg-red-500" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
