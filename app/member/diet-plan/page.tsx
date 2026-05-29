"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Apple, UtensilsCrossed, Flame, Info } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type BmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese"

const dietPlans: Record<BmiCategory, {
  title: string
  calories: string
  focus: string
  meals: string[]
  note: string
}> = {
  Underweight: {
    title: "Lean Mass Gain Plan",
    calories: "2,600 - 2,900 kcal",
    focus: "Protein-rich meals with a small calorie surplus.",
    meals: ["Oats with banana and peanut butter", "Chicken rice bowl with veggies", "Paneer or tofu wrap", "Greek yogurt with nuts"],
    note: "Add an extra snack between lunch and dinner to support healthy weight gain.",
  },
  Normal: {
    title: "Maintenance Plan",
    calories: "2,200 - 2,500 kcal",
    focus: "Balanced carbs, proteins, and healthy fats.",
    meals: ["Eggs and toast breakfast", "Grilled chicken salad", "Rice, dal, and vegetables", "Fruit smoothie or protein shake"],
    note: "Keep meals consistent and pair them with regular strength training.",
  },
  Overweight: {
    title: "Fat Loss Plan",
    calories: "1,800 - 2,100 kcal",
    focus: "Higher protein, more fiber, controlled portions.",
    meals: ["Veggie omelette", "Lean protein with salad", "Millet bowl with stir-fried vegetables", "Low-fat curd with seeds"],
    note: "Prioritize whole foods and keep liquid calories to a minimum.",
  },
  Obese: {
    title: "Reset Plan",
    calories: "1,600 - 1,900 kcal",
    focus: "Simple meals, high satiety, and steady calorie reduction.",
    meals: ["Fruit and oats bowl", "Chicken or paneer salad", "Soup with lean protein", "Nuts and seeds in controlled portions"],
    note: "Pair nutrition changes with walking, light cardio, and trainer support.",
  },
}

function getCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export default function DietPlanPage() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")

  const result = useMemo(() => {
    const weightValue = Number(weight)
    const heightValue = Number(height)

    if (!weightValue || !heightValue) return null

    const bmi = weightValue / Math.pow(heightValue / 100, 2)
    const category = getCategory(bmi)

    return {
      bmi: Number(bmi.toFixed(1)),
      category,
      plan: dietPlans[category],
    }
  }, [weight, height])

  return (
    <div className="min-h-screen">
      <DashboardHeader title="BMI-Based Diet Plan" subtitle="Get a nutrition plan that fits your BMI range" />

      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                Check your BMI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diet-weight">Weight (kg)</Label>
                <Input id="diet-weight" type="number" placeholder="e.g. 72" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diet-height">Height (cm)</Label>
                <Input id="diet-height" type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
              <p className="text-sm text-muted-foreground">Enter both values and the plan updates automatically.</p>
            </CardContent>
          </Card>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                  {result ? result.plan.title : "Your diet plan"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/15 text-primary">{result.category}</Badge>
                      <Badge variant="secondary">BMI {result.bmi}</Badge>
                      <Badge variant="secondary">{result.plan.calories}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.plan.focus}</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      {result.plan.meals.map((meal) => (
                        <div key={meal} className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground">
                          {meal}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
                      <div className="mb-2 flex items-center gap-2 text-foreground">
                        <Info className="h-4 w-4 text-primary" />
                        Coach note
                      </div>
                      {result.plan.note}
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                    <div className="space-y-3">
                      <Flame className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Enter your weight and height to see the matching diet plan.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
