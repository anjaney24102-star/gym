"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { LogOut, UserCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { clearAuthSession, readAuthSession, type AuthSessionMember } from "@/lib/auth-session"

export default function MemberProfilePage() {
  const [member, setMember] = useState<AuthSessionMember | null>(null)

  useEffect(() => {
    setMember(readAuthSession())
  }, [])

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Member Profile" subtitle="Your saved account details and quick actions" />

      <div className="p-6">
        {!member ? (
          <Card className="glass-card border-border mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle>You're not signed in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use your existing account to access the member portal or create a new one if you do not have an account yet.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/member/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/member/signup">Create account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle2 className="h-5 w-5 text-primary" />
                  {member.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/15 text-primary">{member.membershipStatus}</Badge>
                  <Badge variant="secondary">ID #{member.id}</Badge>
                  <Badge variant="secondary">{member.phone || "No phone saved"}</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Attendance</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{member.attendanceCount}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Calories</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{member.caloriesBurned}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{member.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle>Account actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/member/dashboard">Open dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/member/bmi">Go to BMI calculator</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    clearAuthSession()
                    setMember(null)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
