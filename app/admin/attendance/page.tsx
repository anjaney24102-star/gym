"use client"

import { useEffect, useState } from "react"
import { CalendarCheck, Users, Clock3, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AttendanceSummary {
  overview: { daily: number; weekly: number; monthly: number }
  members: Array<{
    id: number
    name: string
    email: string
    phone: string | null
    membershipStatus: string
    attendanceCount: number
    attendanceDays: number
    joinedAt: string
  }>
  expiringSoon: Array<{
    id: number
    name: string
    email: string
    phone: string | null
    membershipStatus: string
    expiryDate: string
  }>
}

export default function AdminAttendancePage() {
  const [data, setData] = useState<AttendanceSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/attendance")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load attendance")
        setData(json)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const sanitizePhone = (phone: string | null) => (phone ?? "").replace(/[^\d]/g, "")

  const reminderMessage = (name: string, daysRemaining: number) =>
    `Hi ${name}, your Titan Fitness membership expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}. Please renew it to continue without interruption.`

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Attendance Sheet" subtitle="Admin view for daily, weekly, monthly attendance and expiry alerts" />

      <div className="p-6 space-y-6">
        {loading ? (
          <Card className="glass-card border-border"><CardContent className="p-6 text-sm text-muted-foreground">Loading attendance data…</CardContent></Card>
        ) : !data ? (
          <Card className="glass-card border-border"><CardContent className="p-6 text-sm text-destructive">Unable to load attendance report.</CardContent></Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-foreground">{data.overview.daily}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total attendance today</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-foreground">{data.overview.weekly}</div>
                  <p className="text-xs text-muted-foreground mt-1">Attendance in the last 7 days</p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                  <Clock3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-foreground">{data.overview.monthly}</div>
                  <p className="text-xs text-muted-foreground mt-1">Attendance in the current month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle>Everyone’s attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Visits</TableHead>
                      <TableHead>Visit Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                        <TableCell className="text-muted-foreground">{member.email}</TableCell>
                        <TableCell className="text-muted-foreground">{member.phone || "—"}</TableCell>
                        <TableCell><Badge variant="secondary">{member.membershipStatus}</Badge></TableCell>
                        <TableCell>{member.attendanceCount}</TableCell>
                        <TableCell>{member.attendanceDays}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-400" /> Expiring in 10 days</CardTitle>
              </CardHeader>
              <CardContent>
                {data.expiringSoon.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No memberships are expiring in the next 10 days.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Expires On</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.expiringSoon.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                          <TableCell className="text-muted-foreground">{member.phone || "—"}</TableCell>
                          <TableCell><Badge variant="outline">{member.membershipStatus}</Badge></TableCell>
                          <TableCell>{new Date(member.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {member.phone ? (
                                <>
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={`tel:${member.phone}`}>Call</Link>
                                  </Button>
                                  <Button asChild size="sm" className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
                                    <Link
                                      href={`https://wa.me/${sanitizePhone(member.phone)}?text=${encodeURIComponent(
                                        reminderMessage(member.name, Math.max(Math.ceil((new Date(member.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0))
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      WhatsApp
                                    </Link>
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">No phone number</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
