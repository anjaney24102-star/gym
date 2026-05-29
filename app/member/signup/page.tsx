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
import { saveAuthSession } from "@/lib/auth-session"

export default function MemberSignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", phone: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      saveAuthSession(data.member)
      setMessage("Account created successfully. Redirecting...")
      router.push(data.redirectTo || "/member/dashboard")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Sign Up" subtitle="Create your member account with a username, phone number, and password" />
      <div className="p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="glass-card border-border bg-gradient-to-br from-background via-background to-primary/10">
            <CardHeader>
              <CardTitle>Why join Titan</CardTitle>
              <CardDescription>Once your account is created, we store it in the existing database and take you to the portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Persisted in the current SQLite-backed member table</p>
              <p>• Username and phone number are checked for duplicates</p>
              <p>• Passwords are hashed before storage</p>
              <p>• Login routes straight into the authenticated member area</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Create your account
              </CardTitle>
              <CardDescription>Enter the details you will use to sign in later.</CardDescription>
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
                    placeholder="Choose a username"
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
                    <Link href="/member/login">Already have an account?</Link>
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
