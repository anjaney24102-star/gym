"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageCircleMore,
  Megaphone,
  Plus,
  Send,
  Timer,
  Users,
  UtensilsCrossed,
  Dumbbell,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { trainerData } from "@/lib/dashboard-data"
import { readTrainerSession } from "@/lib/trainer-session"
import type { DashboardNotification } from "@/components/dashboard/dashboard-header"

type SessionItem = (typeof trainerData.sessions)[number]
type AnnouncementItem = (typeof trainerData.announcements)[number]
type ChatItem = (typeof trainerData.chatThreads)[number]
type AssignmentItem = (typeof trainerData.assignmentDrafts)[number]

function currentClock() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function TrainerDashboard() {
  const [profileName, setProfileName] = useState(trainerData.name)
  const [checkInTime, setCheckInTime] = useState(trainerData.checkInTime)
  const [checkOutTime, setCheckOutTime] = useState<string>("Pending")
  const [isOnDuty, setIsOnDuty] = useState(true)
  const [sessions, setSessions] = useState<SessionItem[]>(trainerData.sessions)
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(trainerData.announcements)
  const [messages, setMessages] = useState<ChatItem[]>(trainerData.chatThreads)
  const [assignments, setAssignments] = useState<AssignmentItem[]>(trainerData.assignmentDrafts)
  const [sessionForm, setSessionForm] = useState({
    title: "",
    time: "",
    duration: "",
    audience: "",
  })
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "medium",
  })
  const [chatReply, setChatReply] = useState("")
  const [assignmentForm, setAssignmentForm] = useState({
    member: "",
    dietPlan: "",
    workoutRoutine: "",
    notes: "",
  })

  useEffect(() => {
    const session = readTrainerSession()
    if (session?.name) {
      setProfileName(session.name)
    }
    if (session?.checkInTime) {
      setCheckInTime(session.checkInTime)
    }
    if (session?.checkOutTime) {
      setCheckOutTime(session.checkOutTime)
      setIsOnDuty(false)
    }
  }, [])

  const totalNotifications = trainerData.notifications.filter((item) => !item.read).length
  const todayWorkingHours = isOnDuty ? "In progress" : checkOutTime
  const totalHoursPercent = Math.min(Math.round((trainerData.monthWorkingHours / 160) * 100), 100)

  const handleCheckIn = () => {
    const time = currentClock()
    setCheckInTime(time)
    setCheckOutTime("Pending")
    setIsOnDuty(true)
  }

  const handleCheckOut = () => {
    setCheckOutTime(currentClock())
    setIsOnDuty(false)
  }

  const handleSessionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!sessionForm.title.trim()) return

    setSessions((current) => [
      {
        id: Date.now(),
        title: sessionForm.title.trim(),
        time: sessionForm.time || currentClock(),
        duration: sessionForm.duration || "45 min",
        audience: sessionForm.audience || "All members",
        mode: "In-gym",
      },
      ...current,
    ])

    setSessionForm({ title: "", time: "", duration: "", audience: "" })
  }

  const handleAnnouncementSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) return

    setAnnouncements((current) => [
      {
        id: Date.now(),
        title: announcementForm.title.trim(),
        content: announcementForm.content.trim(),
        priority: announcementForm.priority,
        time: "Just now",
      },
      ...current,
    ])

    setAnnouncementForm({ title: "", content: "", priority: "medium" })
  }

  const handleChatReply = () => {
    if (!chatReply.trim()) return

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "trainer",
        name: profileName,
        message: chatReply.trim(),
        time: currentClock(),
      },
    ])

    setChatReply("")
  }

  const handleAssignmentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!assignmentForm.member.trim()) return

    setAssignments((current) => [
      {
        id: Date.now(),
        member: assignmentForm.member.trim(),
        dietPlan: assignmentForm.dietPlan.trim() || "Custom nutrition guidance",
        workoutRoutine: assignmentForm.workoutRoutine.trim() || "Custom training split",
        notes: assignmentForm.notes.trim() || "Follow up in the next session.",
      },
      ...current,
    ])

    setAssignmentForm({ member: "", dietPlan: "", workoutRoutine: "", notes: "" })
  }

  const notifications: DashboardNotification[] = trainerData.notifications

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={`Trainer Dashboard`}
        subtitle={`Welcome back, ${profileName}. Manage sessions, chats, and member plans from one place.`}
        notifications={notifications}
      />

      <div className="space-y-6 p-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-gradient-to-br from-background via-background to-primary/10 p-6 shadow-lg"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit bg-primary/15 text-primary">Are you a trainer? This is your workspace.</Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Check in, create sessions, broadcast announcements, chat with members, and assign plans.
              </h2>
              <p className="max-w-3xl text-muted-foreground">
                Trainer activity now flows into one clean dashboard, while admin can review session count and working hours from the admin panel.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-border bg-card/80 p-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Check-in</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{checkInTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Check-out</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{checkOutTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Duty status</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{isOnDuty ? "On duty" : "Completed"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Alerts</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{totalNotifications} unread</p>
              </div>
            </div>
          </div>
        </motion.section>

        <StatCardGrid>
          <StatCard
            title="Sessions Today"
            value={trainerData.todaySessions}
            subtitle="Classes and 1:1 coaching"
            icon={CalendarClock}
            delay={0.1}
          />
          <StatCard
            title="Monthly Working Hours"
            value={trainerData.monthWorkingHours}
            subtitle="Logged hours this month"
            icon={Timer}
            trend={{ value: 8.4, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Total Working Hours"
            value={trainerData.totalWorkingHours}
            subtitle="Historic trainer hours"
            icon={Clock3}
            delay={0.3}
          />
          <StatCard
            title="Assigned Members"
            value={trainerData.assignedMembers.length}
            subtitle="Active programs in motion"
            icon={Users}
            delay={0.4}
          />
        </StatCardGrid>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Check-in / Check-out
              </CardTitle>
              <CardDescription>Track your work window and shift status for admin reporting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" id="check-in">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Check-in time</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{checkInTime}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Check-out time</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{checkOutTime}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Working hours</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{trainerData.monthWorkingHours}h this month</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCheckIn}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Check In
                </Button>
                <Button variant="outline" onClick={handleCheckOut}>
                  <Timer className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Working hours progress</span>
                  <span className="font-medium text-foreground">{totalHoursPercent}%</span>
                </div>
                <Progress value={totalHoursPercent} className="h-2" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Today&apos;s sessions</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{trainerData.todaySessions}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Duty state</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{isOnDuty ? "Active" : "Closed"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Trainer Summary
              </CardTitle>
              <CardDescription>Profile and workload snapshot for the current trainer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">Trainer profile</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{profileName}</p>
                <p className="text-sm text-muted-foreground">{trainerData.specialization}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{trainerData.trainerId}</Badge>
                  <Badge variant="secondary">{trainerData.role}</Badge>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sessions this week</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{trainerData.weeklySessions}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Assigned members</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{trainerData.assignedMembers.length}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly utilization</span>
                  <span className="font-medium text-foreground">{trainerData.monthWorkingHours}h</span>
                </div>
                <Progress value={Math.min((trainerData.monthWorkingHours / 160) * 100, 100)} className="mt-3 h-2" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="mt-1 font-medium text-foreground">{trainerData.email}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="mt-1 font-medium text-foreground">{trainerData.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card border-border" id="sessions">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                Create Session Time
              </CardTitle>
              <CardDescription>Schedule your coaching blocks and group sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSessionSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-title">Session title</Label>
                  <Input
                    id="session-title"
                    value={sessionForm.title}
                    onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                    placeholder="Leg day bootcamp"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="session-time">Time</Label>
                    <Input
                      id="session-time"
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      placeholder="06:30 AM"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Duration</Label>
                    <Input
                      id="session-duration"
                      value={sessionForm.duration}
                      onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                      placeholder="45 min"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-audience">Audience</Label>
                    <Input
                      id="session-audience"
                      value={sessionForm.audience}
                      onChange={(e) => setSessionForm({ ...sessionForm, audience: e.target.value })}
                      placeholder="Elite members"
                    />
                  </div>
                </div>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Save session
                </Button>
              </form>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.audience}</p>
                      </div>
                      <Badge variant="secondary">{session.mode}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{session.time}</span>
                      <span>|</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border" id="announcements">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Broadcast Announcement
              </CardTitle>
              <CardDescription>This will go out to all users and members in the portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="New session reminder"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-content">Message</Label>
                  <Textarea
                    id="announcement-content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    placeholder="Write the message members should receive"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="announcement-priority">Priority</Label>
                  <Input
                    id="announcement-priority"
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                    placeholder="medium"
                  />
                </div>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Send broadcast
                </Button>
              </form>

              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{announcement.title}</p>
                        <p className="text-sm text-muted-foreground">{announcement.content}</p>
                      </div>
                      <Badge variant="secondary">{announcement.priority}</Badge>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{announcement.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="glass-card border-border" id="chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircleMore className="h-5 w-5 text-primary" />
                Member Chat
              </CardTitle>
              <CardDescription>Reply to member questions, form checks, and progress updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-3xl rounded-2xl border p-4 ${
                      message.sender === "trainer" ? "ml-auto border-primary/20 bg-primary/10" : "border-border bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{message.name}</p>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                    <p className="mt-2 text-sm text-foreground">{message.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Input
                  value={chatReply}
                  onChange={(e) => setChatReply(e.target.value)}
                  placeholder="Type a trainer reply..."
                  className="flex-1"
                />
                <Button onClick={handleChatReply}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border" id="plans">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                Diet and Workout Plans
              </CardTitle>
              <CardDescription>Assign diet plans, workout routines, and notes for each member.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Member</Label>
                  <Input
                    id="member-name"
                    value={assignmentForm.member}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, member: e.target.value })}
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diet-plan">Diet plan</Label>
                  <Textarea
                    id="diet-plan"
                    value={assignmentForm.dietPlan}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dietPlan: e.target.value })}
                    placeholder="High-protein meal structure..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workout-plan">Workout routine</Label>
                  <Textarea
                    id="workout-plan"
                    value={assignmentForm.workoutRoutine}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, workoutRoutine: e.target.value })}
                    placeholder="Push/Pull/Legs split..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan-notes">Notes</Label>
                  <Textarea
                    id="plan-notes"
                    value={assignmentForm.notes}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                    placeholder="Progress target or correction points..."
                    rows={2}
                  />
                </div>
                <Button type="submit">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Assign plan
                </Button>
              </form>

              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{assignment.member}</p>
                      <Badge variant="outline">Assigned</Badge>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-foreground">
                      <p>
                        <span className="font-medium">Diet:</span> {assignment.dietPlan}
                      </p>
                      <p>
                        <span className="font-medium">Workout:</span> {assignment.workoutRoutine}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Notes:</span> {assignment.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
