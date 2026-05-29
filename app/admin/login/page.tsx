"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldUser } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveAdminSession } from "@/lib/admin-session"
import { readAdminSession } from "@/lib/admin-session"

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", phone: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const currentSession = readAdminSession()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      saveAdminSession(data.admin)
      setMessage("Admin signed in successfully. Redirecting...")
      router.push(data.redirectTo || "/admin")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Admin Login" subtitle="Sign in to manage members, roles, progress, and reminders" />
      <div className="p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldUser className="h-5 w-5 text-primary" />
                Welcome back, admin
              </CardTitle>
              <CardDescription>Use the admin profile to open the management console.</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Name</Label>
                  <Input
                    id="username"
                    placeholder="Anjaney"
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
                    placeholder="1234"
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
                    placeholder="264"
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
                    <Link href="/admin/members">Go to member control</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-border bg-gradient-to-br from-primary/10 via-background to-background">
            <CardHeader>
              <CardTitle>Admin powers</CardTitle>
              <CardDescription>Once signed in, you can manage every member and trainer profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>- Search profiles and inspect progress</p>
              <p>- Promote or demote users to admin or trainer</p>
              <p>- Remove accounts when needed</p>
              <p>- Message expiring members on WhatsApp</p>
              <p>- Track expirations within 10 days</p>
              <p className="text-xs text-muted-foreground">Current admin session: {currentSession?.name || "none"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
