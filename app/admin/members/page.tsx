"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  Shield,
  UserCog,
  Users,
  Trash2,
  Phone,
  MessageCircleMore,
  CalendarClock,
  Activity,
  Plus,
  RefreshCw,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

type MemberRecord = {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  membershipStatus: string
  attendanceCount: number
  caloriesBurned: number
  createdAt: string
  updatedAt: string
  membershipExpiresAt?: string | null
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function getExpiryDate(member: MemberRecord) {
  return member.membershipExpiresAt ? new Date(member.membershipExpiresAt) : new Date(new Date(member.createdAt).getTime() + 30 * MS_PER_DAY)
}

function getDaysRemaining(member: MemberRecord) {
  const expiry = getExpiryDate(member)
  return Math.ceil((expiry.getTime() - Date.now()) / MS_PER_DAY)
}

function sanitizePhone(phone: string | null) {
  return (phone ?? "").replace(/[^\d]/g, "")
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    role: "member",
  })

  const loadMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/members")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load members")
      setMembers(json)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        (member.phone ?? "").toLowerCase().includes(query)
      const matchesRole = roleFilter === "all" || member.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [members, roleFilter, search])

  const expiringSoon = filteredMembers.filter((member) => {
    const days = getDaysRemaining(member)
    return days >= 0 && days <= 10
  })

  const summary = useMemo(
    () => ({
      total: members.length,
      admins: members.filter((member) => member.role === "admin").length,
      trainers: members.filter((member) => member.role === "trainer").length,
      expiringSoon: members.filter((member) => {
        const days = getDaysRemaining(member)
        return days >= 0 && days <= 10
      }).length,
    }),
    [members]
  )

  const updateRole = async (member: MemberRecord, role: string) => {
    setSavingId(member.id)
    setMessage("")

    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to update role")

      setMembers((current) => current.map((item) => (item.id === member.id ? { ...item, role: json.role ?? role } : item)))
      setMessage(`${member.name} is now ${role}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update role")
    } finally {
      setSavingId(null)
    }
  }

  const deleteMember = async (member: MemberRecord) => {
    if (!window.confirm(`Delete ${member.name}?`)) return

    setSavingId(member.id)
    setMessage("")

    try {
      const res = await fetch(`/api/members/${member.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete member")
      setMembers((current) => current.filter((item) => item.id !== member.id))
      setMessage(`${member.name} removed from the system.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete member")
    } finally {
      setSavingId(null)
    }
  }

  const createMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavingId(-1)
    setMessage("")

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to create member")

      if (form.role !== "member") {
        await fetch(`/api/members/${json.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: form.role }),
        })
      }

      setForm({ username: "", phone: "", password: "", role: "member" })
      setMessage(`${json.name} added successfully.`)
      await loadMembers()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create member")
    } finally {
      setSavingId(null)
    }
  }

  const makeReminderMessage = (member: MemberRecord) => {
    const days = Math.max(getDaysRemaining(member), 0)
    return `Hi ${member.name}, your Titan Fitness membership expires in ${days} day${days === 1 ? "" : "s"}. Please renew it to continue training without interruption.`
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Member Control"
        subtitle="Search profiles, change roles, remove accounts, and follow expiring memberships"
      />

      <div className="space-y-6 p-6">
        {message && (
          <Card className="glass-card border-border">
            <CardContent className="p-4 text-sm text-primary">{message}</CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{summary.total}</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{summary.admins}</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Trainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{summary.trainers}</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expiring in 10 days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{summary.expiringSoon}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add profile
              </CardTitle>
              <CardDescription>Create a member, trainer, or admin account from one form.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createMember} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Name</Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Temporary password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
                  >
                    <option value="member">Member</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" disabled={savingId === -1}>
                  {savingId === -1 ? "Adding..." : "Add profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search profiles
              </CardTitle>
              <CardDescription>Find members fast and manage their roles or progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1.5fr_0.8fr]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, or phone"
                    className="pl-10"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                >
                  <option value="all">All roles</option>
                  <option value="member">Member</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={loadMembers}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Link href="/admin/attendance">
                  <Button variant="outline">View expirations</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <Card className="glass-card border-border">
              <CardContent className="p-6 text-sm text-muted-foreground">Loading profiles...</CardContent>
            </Card>
          ) : filteredMembers.length === 0 ? (
            <Card className="glass-card border-border">
              <CardContent className="p-6 text-sm text-muted-foreground">No profiles match your search.</CardContent>
            </Card>
          ) : (
            filteredMembers.map((member) => {
              const daysRemaining = getDaysRemaining(member)
              const expiryDate = getExpiryDate(member)
              const reminderMessage = makeReminderMessage(member)
              const waLink = member.phone
                ? `https://wa.me/${sanitizePhone(member.phone)}?text=${encodeURIComponent(reminderMessage)}`
                : "#"
              const progressScore = Math.min(Math.round((member.attendanceCount / 30) * 100), 100)

              return (
                <Card key={member.id} className={`glass-card border-border ${daysRemaining >= 0 && daysRemaining <= 10 ? "border-yellow-500/40" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                          <Badge variant="secondary">{member.role}</Badge>
                          <Badge variant="outline">{member.membershipStatus}</Badge>
                          {daysRemaining >= 0 && daysRemaining <= 10 && (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              Expiring in {daysRemaining} day{daysRemaining === 1 ? "" : "s"}
                            </Badge>
                          )}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          <div className="rounded-2xl border border-border bg-muted/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Contact</p>
                            <p className="mt-2 text-sm text-foreground">{member.email}</p>
                            <p className="text-sm text-muted-foreground">{member.phone || "No phone saved"}</p>
                          </div>
                          <div className="rounded-2xl border border-border bg-muted/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Progress</p>
                            <p className="mt-2 text-sm text-foreground">{member.attendanceCount} visits</p>
                            <p className="text-sm text-muted-foreground">{member.caloriesBurned} calories burned</p>
                            <Progress value={progressScore} className="mt-3 h-2" />
                          </div>
                          <div className="rounded-2xl border border-border bg-muted/20 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Membership</p>
                            <p className="mt-2 text-sm text-foreground">{expiryDate.toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">{daysRemaining} days remaining</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 xl:w-[360px]">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => updateRole(member, "member")} disabled={savingId === member.id}>
                            Member
                          </Button>
                          <Button variant="outline" onClick={() => updateRole(member, "trainer")} disabled={savingId === member.id}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Trainer
                          </Button>
                          <Button variant="outline" onClick={() => updateRole(member, "admin")} disabled={savingId === member.id}>
                            <Shield className="mr-2 h-4 w-4" />
                            Admin
                          </Button>
                          <Button variant="destructive" onClick={() => deleteMember(member)} disabled={savingId === member.id}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-1">
                          {member.phone ? (
                            <Button asChild variant="secondary">
                              <Link href={`tel:${member.phone}`}>
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </Link>
                            </Button>
                          ) : (
                            <Button variant="secondary" disabled>
                              <Phone className="mr-2 h-4 w-4" />
                              No phone
                            </Button>
                          )}

                          {member.phone ? (
                            <Button asChild className="bg-[#25D366] text-white hover:bg-[#25D366]/90">
                              <Link href={waLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircleMore className="mr-2 h-4 w-4" />
                                WhatsApp reminder
                              </Link>
                            </Button>
                          ) : (
                            <Button className="bg-[#25D366] text-white hover:bg-[#25D366]/90" disabled>
                              <MessageCircleMore className="mr-2 h-4 w-4" />
                              No WhatsApp number
                            </Button>
                          )}
                        </div>

                        <div className="rounded-2xl border border-border bg-background/60 p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick note</p>
                          <p className="mt-2 text-sm text-foreground">
                            {daysRemaining >= 0 && daysRemaining <= 10
                              ? `Membership expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}. Send the reminder now.`
                              : "Profile is active and can be updated anytime."}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <Activity className="mr-1 h-3 w-3" />
                            Progress visible
                          </Badge>
                          <Badge variant="secondary">
                            <CalendarClock className="mr-1 h-3 w-3" />
                            Joined {new Date(member.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
