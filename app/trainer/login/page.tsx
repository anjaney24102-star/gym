"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveTrainerSession } from "@/lib/trainer-session"
import { trainerData } from "@/lib/dashboard-data"

export default function TrainerLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      saveTrainerSession({
        id: 1,
        name: trainerData.name,
        email: form.email || trainerData.email,
        phone: trainerData.phone,
        specialization: trainerData.specialization,
        role: "trainer",
        checkInTime: trainerData.checkInTime,
        checkOutTime: "Pending",
        totalWorkingHours: trainerData.totalWorkingHours,
        todaySessions: trainerData.todaySessions,
      })

      setMessage("Logged in successfully. Redirecting...")
      router.push("/trainer/dashboard")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Trainer Login"
        subtitle="Sign in to manage sessions, announcements, chats, and plans"
        notifications={trainerData.notifications}
      />
      <div className="p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" />
                Welcome back, trainer
              </CardTitle>
              <CardDescription>Use your trainer email to open the trainer workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Trainer email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/trainer/signup">Need a trainer account?</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-border bg-gradient-to-br from-primary/10 via-background to-background">
            <CardHeader>
              <CardTitle>Trainer workspace features</CardTitle>
              <CardDescription>After login, trainers can manage the whole floor from a single place.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>- Check-in and check-out tracking</p>
              <p>- Session time creation and scheduling</p>
              <p>- Broadcast announcements to all users</p>
              <p>- Member chat and follow-up</p>
              <p>- Diet plans and workout routine assignments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
