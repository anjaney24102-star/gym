"use client"

import { useEffect, useMemo, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import { motion } from "framer-motion"
import { Calculator, Apple, Dumbbell, TrendingUp, Target, ArrowRight } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { readAuthSession, type AuthSessionMember } from "@/lib/auth-session"

type BmiCategory = "Underweight" | "Normal Weight" | "Overweight" | "Obese" | "Severely Obese"

type CategoryPlan = {
  title: string
  primaryGoal: string
  dietPlan: string[]
  recommendedFoods: {
    protein?: string[]
    carbs?: string[]
    fats?: string[]
    general?: string[]
  }
  sampleDay?: string[]
  trainingPlan: string[]
  cardio?: string[]
  focusAreas?: string[]
  avoid?: string[]
  goals?: string[]
  weeklySplit?: string[]
  phasePlan?: string[]
  stepGoal?: string
}

const bmiRanges = [
  { label: "Underweight", range: "< 18.5" },
  { label: "Normal Weight", range: "18.5 - 24.9" },
  { label: "Overweight", range: "25 - 29.9" },
  { label: "Obese", range: "30 - 34.9" },
  { label: "Severely Obese", range: ">= 35" },
]

const plans: Record<BmiCategory, CategoryPlan> = {
  "Underweight": {
    title: "Underweight Plan",
    primaryGoal: "Gain lean muscle mass and reach a healthy weight.",
    dietPlan: [
      "Eat 300-500 calories above maintenance daily.",
      "Consume 1.6-2.2g protein per kg body weight.",
      "Eat every 3-4 hours.",
      "Prioritize calorie-dense nutritious foods.",
    ],
    recommendedFoods: {
      protein: ["Eggs", "Chicken breast", "Fish", "Paneer", "Milk", "Curd", "Whey protein"],
      carbs: ["Rice", "Oats", "Potatoes", "Sweet potatoes", "Whole wheat bread", "Bananas"],
      fats: ["Peanut butter", "Almonds", "Walnuts", "Cashews", "Olive oil"],
    },
    sampleDay: [
      "Breakfast: Oats, milk, 2 bananas, peanut butter.",
      "Snack: Nuts and milk.",
      "Lunch: Rice, chicken/paneer, vegetables.",
      "Pre-workout: Banana and coffee.",
      "Post-workout: Whey protein and fruit.",
      "Dinner: Rice/roti, protein source, vegetables.",
    ],
    trainingPlan: [
      "Frequency: 4-5 days/week",
      "Progressive overload.",
      "Compound movements.",
      "Heavy lifting with proper form.",
    ],
    weeklySplit: ["Day 1: Chest + Triceps", "Day 2: Back + Biceps", "Day 3: Rest", "Day 4: Legs", "Day 5: Shoulders + Abs"],
    cardio: ["Maximum 1-2 sessions/week.", "15-20 minutes light walking."],
  },
  "Normal Weight": {
    title: "Normal Weight Plan",
    primaryGoal: "Maintain health while improving physique.",
    dietPlan: [
      "Eat at maintenance calories.",
      "Protein: 1.6-2.0g/kg body weight.",
      "Balanced intake of carbs and fats.",
      "Consume fruits and vegetables daily.",
    ],
    recommendedFoods: {
      general: ["Lean proteins", "Whole grains", "Fruits and vegetables", "Healthy fats"],
    },
    trainingPlan: [
      "Frequency: 4-6 days/week",
      "Options: Push/Pull/Legs, Upper/Lower Split, Bodybuilding Split.",
    ],
    weeklySplit: ["Push", "Pull", "Legs", "Rest", "Push", "Pull", "Legs"],
    cardio: ["2-3 sessions/week.", "20-30 minutes moderate intensity."],
    goals: ["Muscle growth.", "Athletic performance.", "Improved strength."],
  },
  Overweight: {
    title: "Overweight Plan",
    primaryGoal: "Lose body fat while preserving muscle.",
    dietPlan: [
      "Maintain a 300-500 calorie deficit.",
      "Protein: 2.0-2.2g/kg body weight.",
      "Increase fiber intake.",
      "Drink 3-4 liters of water daily.",
    ],
    recommendedFoods: {
      protein: ["Eggs", "Chicken breast", "Fish", "Paneer"],
      general: ["Vegetables", "Oats", "Brown rice", "Fruits"],
    },
    avoid: ["Sugary beverages.", "Excess sweets.", "Fried foods.", "Highly processed snacks."],
    sampleDay: [
      "Breakfast: Omelette and fruit.",
      "Lunch: Chicken, rice, vegetables.",
      "Snack: Greek yogurt or curd.",
      "Dinner: Protein source and vegetables.",
    ],
    trainingPlan: [
      "Frequency: 5-6 days/week",
      "Weight Training: 4 days/week.",
      "Focus on large muscle groups.",
    ],
    cardio: ["30-45 minutes.", "4-5 times/week."],
    stepGoal: "8,000-12,000 daily.",
    weeklySplit: ["Upper Body", "Lower Body", "Cardio", "Upper Body", "Lower Body", "Cardio", "Rest"],
  },
  Obese: {
    title: "Obese Plan",
    primaryGoal: "Sustainable fat loss and improved health.",
    dietPlan: [
      "Moderate calorie deficit.",
      "High-protein diet.",
      "High-fiber foods.",
      "Control portion sizes.",
    ],
    recommendedFoods: {
      general: ["Protein at every meal", "Vegetables with lunch and dinner", "Water before meals", "Limit liquid calories"],
    },
    avoid: ["Soft drinks.", "Excessive fast food.", "Frequent desserts.", "Late-night binge eating."],
    trainingPlan: [
      "Phase 1 (Weeks 1-4): Walking 30-45 minutes daily, full-body resistance training 3 times/week.",
      "Phase 2 (Weeks 5-12): Increase walking speed, add cycling or swimming, increase resistance training volume.",
    ],
    sampleDay: [
      "Strength routine: Leg Press, Chest Press, Lat Pulldown, Seated Row, Shoulder Press.",
    ],
    cardio: ["Step Goal: 7,000-10,000 daily."],
    phasePlan: [
      "Walking 30-45 minutes daily.",
      "Full-body resistance training 3 times/week.",
      "Increase walking speed over time.",
      "Add cycling or swimming.",
      "Increase resistance training volume.",
    ],
  },
  "Severely Obese": {
    title: "Severely Obese Plan",
    primaryGoal: "Improve mobility, cardiovascular health, and safely reduce body weight.",
    dietPlan: [
      "Structured calorie-controlled plan.",
      "High protein.",
      "High fiber.",
      "Consistent meal timing.",
    ],
    recommendedFoods: {
      general: ["Protein source", "Vegetables", "Controlled carbohydrates", "Healthy fats"],
    },
    trainingPlan: [
      "Beginner Phase: Walking 15-30 minutes daily, mobility exercises, chair exercises if needed, resistance training 2-3 times/week.",
      "Progressive Phase: Increase walking duration, add resistance bands, add gym machines, gradually build strength.",
    ],
    focusAreas: ["Joint safety.", "Mobility.", "Cardiovascular health.", "Long-term consistency."],
  },
}

function getCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal Weight"
  if (bmi < 30) return "Overweight"
  if (bmi < 35) return "Obese"
  return "Severely Obese"
}

function parseNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function Section({ icon: Icon, title, children }: { icon: ComponentType<{ className?: string }>; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">{title}</h3>
      </div>
      <div className="space-y-2 text-sm text-foreground">{children}</div>
    </div>
  )
}

export function MemberDashboard() {
  const [member, setMember] = useState<AuthSessionMember | null>(null)
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")

  useEffect(() => {
    setMember(readAuthSession())
  }, [])

  const result = useMemo(() => {
    const weightValue = parseNumber(weight)
    const heightValue = parseNumber(height)

    if (!weightValue || !heightValue) return null

    const bmi = weightValue / Math.pow(heightValue / 100, 2)
    const category = getCategory(bmi)

    return {
      bmi: Number(bmi.toFixed(1)),
      category,
      plan: plans[category],
      score: {
        "Underweight": 72,
        "Normal Weight": 82,
        "Overweight": 76,
        "Obese": 68,
        "Severely Obese": 60,
      }[category],
    }
  }, [height, weight])

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={member ? `Welcome back, ${member.name}` : "Member Portal"}
        subtitle="Calculate your BMI once, then get the full plan in one place"
      />

      <div className="p-6 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background via-background to-primary/10 p-6 shadow-lg"
        >
          <div className="space-y-3">
            <Badge className="w-fit bg-primary/15 text-primary">BMI-first dashboard</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Enter your weight and height, and we’ll generate the full plan based on your BMI.
            </h2>
            <p className="max-w-3xl text-muted-foreground">
              The result will show your BMI category along with the matching diet, training, cardio, and progress guidance.
            </p>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Calculate BMI
              </CardTitle>
              <CardDescription>Use your latest weight and height to generate the full plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-weight">Weight (kg)</Label>
                <Input
                  id="member-weight"
                  type="number"
                  placeholder="e.g. 72"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-height">Height (cm)</Label>
                <Input
                  id="member-height"
                  type="number"
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                As soon as both fields have values, the full recommendation updates automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle>Live Summary</CardTitle>
              <CardDescription>The combined recommendation generated from the BMI result.</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-primary/15 text-primary">{result.category}</Badge>
                    <Badge variant="secondary">BMI {result.bmi}</Badge>
                    <Badge variant="secondary">Goal score {result.score}%</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Momentum</span>
                      <span className="font-medium text-foreground">{result.score}%</span>
                    </div>
                    <Progress value={result.score} className="h-2" />
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                    <p className="text-sm uppercase tracking-[0.16em] text-primary">Primary Goal</p>
                    <p className="mt-2 text-sm text-foreground">{result.plan.primaryGoal}</p>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    <Section icon={Apple} title="Diet Plan">
                      {result.plan.dietPlan.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </Section>

                    <Section icon={Dumbbell} title="Training Plan">
                      {result.plan.trainingPlan.map((item) => (
                        <p key={item}>• {item}</p>
                      ))}
                    </Section>

                    <Section icon={Target} title="Recommended Foods">
                      {result.plan.recommendedFoods.protein && (
                        <div>
                          <p className="font-medium text-foreground">Protein:</p>
                          <p>{result.plan.recommendedFoods.protein.join(", ")}</p>
                        </div>
                      )}
                      {result.plan.recommendedFoods.carbs && (
                        <div>
                          <p className="font-medium text-foreground">Carbs:</p>
                          <p>{result.plan.recommendedFoods.carbs.join(", ")}</p>
                        </div>
                      )}
                      {result.plan.recommendedFoods.fats && (
                        <div>
                          <p className="font-medium text-foreground">Fats:</p>
                          <p>{result.plan.recommendedFoods.fats.join(", ")}</p>
                        </div>
                      )}
                      {result.plan.recommendedFoods.general && (
                        <div className="space-y-1">
                          {result.plan.recommendedFoods.general.map((item) => (
                            <p key={item}>• {item}</p>
                          ))}
                        </div>
                      )}
                    </Section>

                    {result.plan.sampleDay && (
                      <Section icon={ArrowRight} title="Sample Day">
                        {result.plan.sampleDay.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}

                    {result.plan.weeklySplit && (
                      <Section icon={TrendingUp} title="Workout Split">
                        {result.plan.weeklySplit.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}

                    {result.plan.cardio && (
                      <Section icon={Calculator} title="Cardio">
                        {result.plan.cardio.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}

                    {result.plan.avoid && (
                      <Section icon={Target} title="Avoid">
                        {result.plan.avoid.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}

                    {result.plan.goals && (
                      <Section icon={TrendingUp} title="Goals">
                        {result.plan.goals.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}

                    {result.plan.phasePlan && (
                      <Section icon={Dumbbell} title="Phase Plan">
                        {result.plan.phasePlan.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}

                    {result.plan.focusAreas && (
                      <Section icon={Target} title="Focus Areas">
                        {result.plan.focusAreas.map((item) => (
                          <p key={item}>• {item}</p>
                        ))}
                      </Section>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-sm font-semibold text-foreground">BMI Reference</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {bmiRanges.map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-background/60 p-3 text-sm">
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-muted-foreground">{item.range}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
                  <div className="space-y-3">
                    <Calculator className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Enter your measurements to generate the full plan.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
