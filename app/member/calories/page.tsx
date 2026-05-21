"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, Apple, Beef, Salad, Coffee, Cookie, Droplet } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { memberData } from "@/lib/dashboard-data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const mealCategories = [
  { name: "Breakfast", icon: Coffee, color: "text-yellow-500" },
  { name: "Lunch", icon: Salad, color: "text-green-500" },
  { name: "Dinner", icon: Beef, color: "text-orange-500" },
  { name: "Snacks", icon: Cookie, color: "text-pink-500" },
]

const defaultMeals = [
  { id: 1, name: "Oatmeal with Banana", calories: 320, protein: 12, carbs: 54, fat: 8, category: "Breakfast" },
  { id: 2, name: "Grilled Chicken Salad", calories: 450, protein: 42, carbs: 18, fat: 22, category: "Lunch" },
  { id: 3, name: "Protein Shake", calories: 180, protein: 30, carbs: 12, fat: 3, category: "Snacks" },
]

export default function CalorieTracker() {
  const [meals, setMeals] = useState(defaultMeals)
  const [water, setWater] = useState(5)
  const dailyGoal = 2500
  const waterGoal = 8

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0)
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0)
  const remaining = dailyGoal - totalCalories

  const macroData = [
    { name: "Protein", value: totalProtein, goal: 150, color: "var(--chart-1)" },
    { name: "Carbs", value: totalCarbs, goal: 250, color: "var(--chart-2)" },
    { name: "Fat", value: totalFat, goal: 70, color: "var(--chart-3)" },
  ]

  const removeMeal = (id: number) => {
    setMeals(meals.filter((meal) => meal.id !== id))
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Calorie Tracker" 
        subtitle="Track your daily nutrition intake"
      />

      <div className="p-6 space-y-6">
        {/* Calorie Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Daily Calorie Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-4xl font-bold text-foreground">{totalCalories}</p>
                    <p className="text-sm text-muted-foreground">of {dailyGoal} cal consumed</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${remaining >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {remaining >= 0 ? "remaining" : "over goal"}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={Math.min((totalCalories / dailyGoal) * 100, 100)} 
                  className="h-4"
                />
                
                {/* Macro breakdown */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {macroData.map((macro) => (
                    <div key={macro.name} className="text-center p-4 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">{macro.name}</p>
                      <p className="text-2xl font-bold text-foreground">{macro.value}g</p>
                      <Progress 
                        value={(macro.value / macro.goal) * 100} 
                        className="h-1.5 mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">of {macro.goal}g</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Water Intake */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(water / waterGoal) * 352} 352`}
                        className="text-blue-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{water}</span>
                      <span className="text-sm text-muted-foreground">of {waterGoal}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">glasses today</p>
                  <div className="flex gap-3 mt-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setWater(Math.max(0, water - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="icon"
                      onClick={() => setWater(water + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  calories: {
                    label: "Calories",
                    color: "var(--primary)",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberData.weeklyCalories}>
                    <XAxis dataKey="day" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="calories" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">{`Today's Meals`}</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mealCategories.map((category) => {
                  const categoryMeals = meals.filter((m) => m.category === category.name)
                  return (
                    <div key={category.name}>
                      <div className="flex items-center gap-2 mb-3">
                        <category.icon className={`w-5 h-5 ${category.color}`} />
                        <h3 className="font-medium text-foreground">{category.name}</h3>
                        <Badge variant="secondary" className="ml-auto">
                          {categoryMeals.reduce((sum, m) => sum + m.calories, 0)} cal
                        </Badge>
                      </div>
                      {categoryMeals.length > 0 ? (
                        <div className="space-y-2">
                          {categoryMeals.map((meal) => (
                            <div 
                              key={meal.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <p className="font-medium text-foreground">{meal.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-foreground">{meal.calories} cal</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeMeal(meal.id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-3 text-center">No meals logged</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
