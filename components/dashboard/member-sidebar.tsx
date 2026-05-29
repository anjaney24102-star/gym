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
import { clearAuthSession } from "@/lib/auth-session"

const memberNavItems = [
  { name: "Dashboard", href: "/member/dashboard", icon: Home },
  { name: "Attendance", href: "/member/attendance", icon: Calendar },
  { name: "Diet Plan", href: "/member/diet-plan", icon: Flame },
  { name: "Workouts", href: "/member/workouts", icon: Dumbbell },
  { name: "Exercise Library", href: "/member/exercises", icon: PlayCircle },
  { name: "Progress", href: "/member/progress", icon: TrendingUp },
  { name: "BMI Calculator", href: "/member/bmi", icon: Calculator },
  { name: "Membership", href: "/member/membership", icon: CreditCard },
  { name: "Profile", href: "/member/profile", icon: User },
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
      const records = raw ? JSON.parse(raw) : memberData.attendance.map((d) => startOfDayISO(new Date(d.date)))
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
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar"
    >
      <div className="flex items-center justify-between border-b border-sidebar-border p-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">TITAN</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-muted-foreground hover:text-foreground", collapsed && "mx-auto mt-2")}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {memberNavItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex w-full items-center justify-between gap-2">
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

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Rahul Sharma</p>
              <p className="text-xs text-muted-foreground">Elite Member</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className={cn(
            "mt-3 w-full text-muted-foreground hover:text-destructive",
            collapsed ? "px-0 justify-center" : "justify-start"
          )}
          asChild
        >
          <Link
            href="/member/login"
            onClick={() => {
              clearAuthSession()
              localStorage.removeItem(ATTENDANCE_STORAGE_KEY)
            }}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Link>
        </Button>
      </div>
    </motion.aside>
  )
}
