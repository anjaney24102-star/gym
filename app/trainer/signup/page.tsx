"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trainerData } from "@/lib/dashboard-data"
import { saveTrainerSession } from "@/lib/trainer-session"

export default function TrainerSignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      saveTrainerSession({
        id: Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        specialization: form.specialization || "General Fitness",
        role: "trainer",
        checkInTime: "Pending",
        checkOutTime: "Pending",
        totalWorkingHours: 0,
        todaySessions: 0,
      })

      setMessage("Trainer account created successfully. Redirecting...")
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
        title="Trainer Sign Up"
        subtitle="Create a trainer account for check-ins, sessions, and plans"
        notifications={trainerData.notifications}
      />
      <div className="p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="glass-card border-border bg-gradient-to-br from-background via-background to-primary/10">
            <CardHeader>
              <CardTitle>Why join as a trainer</CardTitle>
              <CardDescription>Get a dedicated workspace to manage the full member experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>- Track check-in and check-out time</p>
              <p>- Create session schedules and broadcast announcements</p>
              <p>- Chat with members and answer questions fast</p>
              <p>- Assign diet plans and workout routines</p>
              <p>- Keep admin visible on session count and working hours</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Create trainer account
              </CardTitle>
              <CardDescription>Fill in your trainer profile and start managing your sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                    required
                  />
                </div>

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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    placeholder="Strength training, yoga, nutrition..."
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/trainer/login">Already have a trainer account?</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
