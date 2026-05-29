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
import { saveAuthSession } from "@/lib/auth-session"

export default function MemberLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", phone: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      saveAuthSession(data.member)
      setMessage("Logged in successfully. Redirecting...")
      router.push(data.redirectTo || "/member/dashboard")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Member Login" subtitle="Sign in with your username, phone number, and password" />
      <div className="p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" />
                Welcome back
              </CardTitle>
              <CardDescription>Use your registered username and phone number to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    autoComplete="tel"
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
                    <Link href="/member/signup">Need an account?</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-border bg-gradient-to-br from-primary/10 via-background to-background">
            <CardHeader>
              <CardTitle>What happens after login</CardTitle>
              <CardDescription>We take you straight to the member portal with your next training options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• BMI Calculator</p>
              <p>• BMI-Based Diet Plan</p>
              <p>• BMI-Based Workout Recommendations</p>
              <p>• Progress Tracking</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
