"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import { memberData } from "@/lib/dashboard-data"

const STORAGE_KEY = "titan_attendance_records"

function startOfDayISO(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function formatDateISO(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString()
}

export default function AttendanceTracker() {
  const [records, setRecords] = useState<string[]>([])
  const todayISO = useMemo(() => startOfDayISO(new Date()), [])
  const alreadyCheckedIn = records.includes(todayISO)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const initial = raw
        ? JSON.parse(raw)
        : memberData.attendance.map((d) => startOfDayISO(new Date(d.date)))
      setRecords(Array.from(new Set(initial)).sort((a, b) => (a < b ? 1 : -1)))
    } catch (e) {
      setRecords([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const handleCheckIn = () => {
    if (alreadyCheckedIn) return
    setRecords((prev) => {
      const next = Array.from(new Set([todayISO, ...prev])).sort((a, b) => (a < b ? 1 : -1))
      return next
    })
  }

  // compute streak: count consecutive days up to today
  const streak = useMemo(() => {
    const set = new Set(records)
    let count = 0
    let d = new Date()
    while (true) {
      const iso = startOfDayISO(d)
      if (set.has(iso)) {
        count++
        d.setDate(d.getDate() - 1)
      } else break
    }
    return count
  }, [records])

  // weekly view (last 7 days)
  const last7 = useMemo(() => {
    const arr: { date: string; present: boolean }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = startOfDayISO(d)
      arr.push({ date: iso, present: records.includes(iso) })
    }
    return arr
  }, [records])

  const weeklyCount = useMemo(() => last7.filter((d) => d.present).length, [last7])

  return (
    <Card className="glass-card border-border">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Attendance</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Quickly check in and view your history</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current Streak</p>
            <p className="text-lg font-bold text-foreground">{streak} day{streak !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={handleCheckIn} disabled={alreadyCheckedIn} className={alreadyCheckedIn ? "bg-green-600 hover:bg-green-600" : ""}>
            {alreadyCheckedIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Checked
              </>
            ) : (
              "Check In"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm text-muted-foreground">Weekly Attendance</p>
              <p className="text-xs text-muted-foreground">({records.length} total)</p>
            </div>
            <div className="flex items-center gap-2">
              {last7.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${d.present ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {d.present ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{new Date(d.date).toLocaleDateString(undefined, { weekday: "short" }).charAt(0)}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">History</p>
              <div className="space-y-2 max-h-48 overflow-auto">
                {records.length === 0 && <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>}
                {records.map((r) => (
                  <div key={r} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm text-foreground">{formatDateISO(r)}</p>
                      <p className="text-xs text-muted-foreground">Checked in</p>
                    </div>
                    <div className="text-xs text-muted-foreground">—</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Attendance Progress</p>
            <Progress value={(weeklyCount / 7) * 100} className="h-3 rounded-md" />
            <p className="text-xs text-muted-foreground mt-2">{weeklyCount}/7 check-ins in the last week.</p>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Quick Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground">Total Days</p>
                  <p className="text-lg font-bold text-foreground">{records.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground">Best Streak</p>
                  <p className="text-lg font-bold text-foreground">{memberData.stats.longestStreak}d</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
