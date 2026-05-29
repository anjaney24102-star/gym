"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Dumbbell, Target, Zap, ChevronRight } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type WorkoutCategory = "Underweight" | "Normal" | "Overweight" | "Obese"

const workoutPlans: Record<WorkoutCategory, {
  title: string
  focus: string
  frequency: string
  split: string[]
}> = {
  Underweight: {
    title: "Muscle Building Split",
    focus: "Train with progressive overload and adequate rest.",
    frequency: "4 strength sessions + 1 mobility session",
    split: ["Upper Body Strength", "Lower Body Strength", "Push Hypertrophy", "Pull Hypertrophy", "Mobility and core"],
  },
  Normal: {
    title: "Balanced Performance Split",
    focus: "Use a mix of strength, conditioning, and recovery work.",
    frequency: "3 strength sessions + 2 conditioning sessions",
    split: ["Full Body Strength", "Lower Body Power", "Upper Body Power", "HIIT Conditioning", "Active Recovery"],
  },
  Overweight: {
    title: "Fat Loss Split",
    focus: "Keep intensity moderate and increase activity volume.",
    frequency: "3 strength sessions + 3 cardio blocks",
    split: ["Full Body Circuit", "Incline Walk or Bike", "Strength + Core", "Rowing Intervals", "Outdoor Walk"],
  },
  Obese: {
    title: "Low-Impact Restart",
    focus: "Begin with joint-friendly movement and consistent progression.",
    frequency: "5 low-impact sessions",
    split: ["Brisk Walk", "Seated Strength Circuit", "Pool Cardio or Cycling", "Core Stability", "Light Full Body Training"],
  },
}

function getCategory(bmi: number): WorkoutCategory {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export default function WorkoutRecommendationsPage() {
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
      plan: workoutPlans[category],
    }
  }, [weight, height])

  return (
    <div className="min-h-screen">
      <DashboardHeader title="BMI-Based Workout Recommendations" subtitle="Pick a training split that matches your BMI and goal" />

      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Enter your measurements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workout-weight">Weight (kg)</Label>
                <Input id="workout-weight" type="number" placeholder="e.g. 72" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workout-height">Height (cm)</Label>
                <Input id="workout-height" type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} />
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/member/exercises">
                  Browse exercise library
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  {result ? result.plan.title : "Workout recommendation"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/15 text-primary">{result.category}</Badge>
                      <Badge variant="secondary">BMI {result.bmi}</Badge>
                      <Badge variant="secondary">{result.plan.frequency}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.plan.focus}</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      {result.plan.split.map((day) => (
                        <div key={day} className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-muted-foreground">
                      <div className="mb-2 flex items-center gap-2 text-foreground">
                        <Zap className="h-4 w-4 text-primary" />
                        Training tip
                      </div>
                      Focus on form first, then add load or repetitions week by week.
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                    <div className="space-y-3">
                      <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Enter your weight and height to see the matching workout plan.</p>
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
