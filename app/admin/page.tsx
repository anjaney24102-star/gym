"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  CalendarCheck, 
  IndianRupee,
  TrendingUp,
  UserPlus,
  Clock,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminData } from "@/lib/dashboard-data"
import Link from "next/link"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from "recharts"

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Admin Dashboard" 
        subtitle="Titan Fitness Gym Management"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <StatCardGrid>
          <StatCard
            title="Total Members"
            value={adminData.totalMembers}
            subtitle={`${adminData.activeMembers} active`}
            icon={Users}
            trend={{ value: 5.2, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="New This Month"
            value={adminData.newMembersThisMonth}
            subtitle="Member signups"
            icon={UserPlus}
            trend={{ value: 12, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Today's Attendance"
            value={adminData.attendance.today}
            subtitle={`Avg: ${adminData.attendance.average}`}
            icon={CalendarCheck}
            delay={0.3}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${(adminData.revenue.thisMonth / 100000).toFixed(1)}L`}
            subtitle="This month"
            icon={IndianRupee}
            trend={{ value: adminData.revenue.growth, isPositive: true }}
            delay={0.4}
          />
        </StatCardGrid>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-border h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Revenue Overview</CardTitle>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{adminData.revenue.growth}%
                </Badge>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "var(--primary)",
                    },
                  }}
                  className="h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adminData.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="var(--primary)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--primary)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Membership Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="text-foreground">Membership Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    starter: { label: "Starter", color: "var(--chart-1)" },
                    pro: { label: "Pro", color: "var(--chart-2)" },
                    elite: { label: "Elite", color: "var(--chart-3)" },
                  }}
                  className="h-[180px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={adminData.membershipBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="count"
                        nameKey="plan"
                      >
                        {adminData.membershipBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-col gap-2 mt-4">
                  {adminData.membershipBreakdown.map((item, index) => (
                    <div key={item.plan} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm text-muted-foreground">{item.plan}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Weekly Attendance</CardTitle>
              <Link href="/admin/attendance">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  members: {
                    label: "Members",
                    color: "var(--primary)",
                  },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminData.weeklyAttendance}>
                    <XAxis dataKey="day" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="members" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Payments</CardTitle>
                <Link href="/admin/payments">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Member</TableHead>
                      <TableHead className="text-muted-foreground">Plan</TableHead>
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.recentPayments.slice(0, 4).map((payment) => (
                      <TableRow key={payment.id} className="border-border">
                        <TableCell className="text-foreground font-medium">{payment.member}</TableCell>
                        <TableCell className="text-muted-foreground">{payment.plan}</TableCell>
                        <TableCell className="text-foreground">₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={payment.status === "completed" ? "default" : "secondary"}
                            className={payment.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trainers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="glass-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Trainers</CardTitle>
                <Link href="/admin/trainers">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Manage <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.trainers.map((trainer) => (
                    <div 
                      key={trainer.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{trainer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{trainer.name}</p>
                          <p className="text-xs text-muted-foreground">{trainer.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-foreground">{trainer.members} members</p>
                          <p className="text-xs text-yellow-400">★ {trainer.rating}</p>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={trainer.status === "active" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}
                        >
                          {trainer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Announcements & Recent Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Announcements</CardTitle>
                <Link href="/admin/announcements">
                  <Button variant="outline" size="sm">
                    New Announcement
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.announcements.map((announcement) => (
                    <div 
                      key={announcement.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        announcement.priority === "high" 
                          ? "border-primary bg-primary/5" 
                          : announcement.priority === "medium"
                          ? "border-yellow-500 bg-yellow-500/5"
                          : "border-muted bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{announcement.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{announcement.content}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="glass-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Members</CardTitle>
                <Link href="/admin/members">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Plan</TableHead>
                      <TableHead className="text-muted-foreground">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.recentMembers.map((member) => (
                      <TableRow key={member.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{member.name.charAt(0)}</span>
                            </div>
                            <span className="text-foreground font-medium">{member.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            {member.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.joinDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
