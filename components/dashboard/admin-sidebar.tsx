"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  UserCog,
  Bell,
  ClipboardList,
  Megaphone,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Trainers", href: "/admin/trainers", icon: UserCog },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Workouts", href: "/admin/workouts", icon: ClipboardList },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

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
            <div>
              <span className="font-bold text-xl text-sidebar-foreground">TITAN</span>
              <span className="text-xs text-muted-foreground block">Admin Panel</span>
            </div>
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
        {adminNavItems.map((item) => {
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
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Admin User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
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
