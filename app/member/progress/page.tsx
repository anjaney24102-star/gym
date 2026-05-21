"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Scale, Ruler, Activity, Target } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { memberData } from "@/lib/dashboard-data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts"

const bodyMeasurements = [
  { name: "Chest", current: 42, previous: 40, unit: "in" },
  { name: "Waist", current: 32, previous: 34, unit: "in" },
  { name: "Arms", current: 15, previous: 14, unit: "in" },
  { name: "Thighs", current: 24, previous: 23, unit: "in" },
]

export default function ProgressPage() {
  const latestData = memberData.progressData[memberData.progressData.length - 1]
  const previousData = memberData.progressData[memberData.progressData.length - 2]

  const weightChange = latestData.weight - previousData.weight
  const muscleChange = latestData.muscle - previousData.muscle
  const fatChange = latestData.fat - previousData.fat

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Fitness Progress" 
        subtitle="Track your transformation journey"
      />

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Weight</p>
                    <p className="text-3xl font-bold text-foreground">{latestData.weight} kg</p>
                    <div className={`flex items-center gap-1 mt-1 text-sm ${weightChange <= 0 ? "text-green-500" : "text-red-500"}`}>
                      {weightChange <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span>{Math.abs(weightChange)} kg</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Muscle Mass</p>
                    <p className="text-3xl font-bold text-foreground">{latestData.muscle}%</p>
                    <div className={`flex items-center gap-1 mt-1 text-sm ${muscleChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {muscleChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{Math.abs(muscleChange)}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Body Fat</p>
                    <p className="text-3xl font-bold text-foreground">{latestData.fat}%</p>
                    <div className={`flex items-center gap-1 mt-1 text-sm ${fatChange <= 0 ? "text-green-500" : "text-red-500"}`}>
                      {fatChange <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span>{Math.abs(fatChange)}%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">BMI</p>
                    <p className="text-3xl font-bold text-foreground">23.4</p>
                    <Badge className="mt-1 bg-green-500/20 text-green-400">Normal</Badge>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Ruler className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weight Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Weight Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  weight: {
                    label: "Weight (kg)",
                    color: "var(--primary)",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memberData.progressData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="var(--primary)" 
                      strokeWidth={3}
                      fill="url(#weightGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Body Composition Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Body Composition Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  muscle: { label: "Muscle %", color: "var(--chart-2)" },
                  fat: { label: "Fat %", color: "var(--chart-1)" },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memberData.progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="muscle" 
                      stroke="var(--chart-2)" 
                      strokeWidth={3}
                      dot={{ fill: "var(--chart-2)", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fat" 
                      stroke="var(--chart-1)" 
                      strokeWidth={3}
                      dot={{ fill: "var(--chart-1)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Body Measurements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Body Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bodyMeasurements.map((measurement, index) => {
                  const change = measurement.current - measurement.previous
                  const isImprovement = measurement.name === "Waist" ? change <= 0 : change >= 0
                  
                  return (
                    <motion.div
                      key={measurement.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-4 rounded-lg bg-muted/30 text-center"
                    >
                      <p className="text-sm text-muted-foreground">{measurement.name}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {measurement.current} {measurement.unit}
                      </p>
                      <div className={`flex items-center justify-center gap-1 mt-2 text-sm ${isImprovement ? "text-green-500" : "text-red-500"}`}>
                        {isImprovement ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{change > 0 ? "+" : ""}{change} {measurement.unit}</span>
                      </div>
                    </motion.div>
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
