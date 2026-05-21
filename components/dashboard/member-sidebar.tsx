"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Calendar,
  Flame,
  Dumbbell,
  PlayCircle,
  TrendingUp,
  Calculator,
  CreditCard,
  MessageCircle,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { memberData } from "@/lib/dashboard-data"

const memberNavItems = [
  { name: "Dashboard", href: "/member/dashboard", icon: Home },
  { name: "Attendance", href: "/member/attendance", icon: Calendar },
  { name: "Calorie Tracker", href: "/member/calories", icon: Flame },
  { name: "Workouts", href: "/member/workouts", icon: Dumbbell },
  { name: "Exercise Library", href: "/member/exercises", icon: PlayCircle },
  { name: "Progress", href: "/member/progress", icon: TrendingUp },
  { name: "BMI Calculator", href: "/member/bmi", icon: Calculator },
  { name: "Membership", href: "/member/membership", icon: CreditCard },
  { name: "Trainer Chat", href: "/member/chat", icon: MessageCircle },
  { name: "Motivation", href: "/member/motivation", icon: Sparkles },
]

const ATTENDANCE_STORAGE_KEY = "titan_attendance_records"

function startOfDayISO(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function MemberSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [checkedInToday, setCheckedInToday] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY)
      const records = raw
        ? JSON.parse(raw)
        : memberData.attendance.map((d) => startOfDayISO(new Date(d.date)))
      setCheckedInToday(records.includes(startOfDayISO(new Date())))
    } catch {
      setCheckedInToday(false)
    }
  }, [])

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-sidebar-foreground">TITAN</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-muted-foreground hover:text-foreground", collapsed && "mx-auto mt-2")}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {memberNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.href === "/member/attendance" && checkedInToday && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                      Today
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Rahul Sharma</p>
              <p className="text-xs text-muted-foreground">Elite Member</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full mt-3 text-muted-foreground hover:text-destructive",
            collapsed ? "px-0 justify-center" : "justify-start"
          )}
          asChild
        >
          <Link href="/">
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Link>
        </Button>
      </div>
    </motion.aside>
  )
}
