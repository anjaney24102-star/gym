"use client"

import { motion } from "framer-motion"
import {
  Flame,
  Trophy,
  Dumbbell,
  Target,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { memberData, motivationalQuotes } from "@/lib/dashboard-data"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"

export function MemberDashboard() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleCheckIn = () => {
    setCheckedIn(true)
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Welcome back, Rahul!" subtitle="Ready to crush your goals today?" />

      <div className="p-6 space-y-6">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-xl p-6 border-l-4 border-primary"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="text-lg text-foreground italic">{`"${motivationalQuotes[currentQuote].quote}"`}</p>
              <p className="text-sm text-muted-foreground mt-2">- {motivationalQuotes[currentQuote].author}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Daily Check-in</h3>
                <p className="text-sm text-muted-foreground">
                  {checkedIn ? "You're checked in for today!" : "Mark your attendance for today"}
                </p>
              </div>
            </div>
            <Button onClick={handleCheckIn} disabled={checkedIn} className={checkedIn ? "bg-green-600 hover:bg-green-600" : ""}>
              {checkedIn ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Checked In
                </>
              ) : (
                "Check In Now"
              )}
            </Button>
          </div>
        </motion.div>

        <StatCardGrid>
          <StatCard
            title="Current Streak"
            value={`${memberData.stats.currentStreak} days`}
            subtitle={`Best: ${memberData.stats.longestStreak} days`}
            icon={Flame}
            delay={0.1}
          />
          <StatCard
            title="Total Workouts"
            value={memberData.stats.totalWorkouts}
            subtitle="This year"
            icon={Dumbbell}
            delay={0.2}
          />
          <StatCard
            title="Calories Burned"
            value={memberData.stats.caloriesBurned.toLocaleString()}
            subtitle="Total lifetime"
            icon={Target}
            delay={0.3}
          />
          <StatCard
            title="Membership"
            value={memberData.plan}
            subtitle={`Expires: ${new Date(memberData.expiryDate).toLocaleDateString()}`}
            icon={Trophy}
            delay={0.4}
          />
        </StatCardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Weekly Calories</CardTitle>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Body Progress</CardTitle>
                <Link href="/member/progress">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    weight: { label: "Weight (kg)", color: "var(--chart-1)" },
                    muscle: { label: "Muscle (%)", color: "var(--chart-2)" },
                  }}
                  className="h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={memberData.progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="weight" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: "var(--chart-1)" }} />
                      <Line type="monotone" dataKey="muscle" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: "var(--chart-2)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Today's Workout</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{memberData.todayWorkout.name}</p>
              </div>
              <Link href="/member/workouts">
                <Button>Start Workout</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberData.todayWorkout.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.sets} sets x {exercise.reps} reps @ {exercise.weight}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2">
                {memberData.attendance.map((day, index) => (
                  <div key={day.date} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        day.present
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day.present ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-xs">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Weekly Progress</span>
                  <span className="text-foreground font-medium">
                    {memberData.attendance.filter((d) => d.present).length}/7 days
                  </span>
                </div>
                <Progress value={(memberData.attendance.filter((d) => d.present).length / 7) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
