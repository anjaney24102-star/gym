"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  CalendarClock,
  Megaphone,
  MessageCircleMore,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { clearTrainerSession } from "@/lib/trainer-session"

const trainerNavItems = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Sessions", href: "/trainer/dashboard#sessions", icon: CalendarClock },
  { name: "Announcements", href: "/trainer/dashboard#announcements", icon: Megaphone },
  { name: "Chat", href: "/trainer/dashboard#chat", icon: MessageCircleMore },
  { name: "Plans", href: "/trainer/dashboard#plans", icon: ClipboardList },
]

export function TrainerSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar"
    >
      <div className="flex items-center justify-between border-b border-sidebar-border p-4">
        {!collapsed ? (
          <Link href="/trainer/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="block text-xl font-bold text-sidebar-foreground">TITAN</span>
              <span className="block text-xs text-muted-foreground">Trainer Panel</span>
            </div>
          </Link>
        ) : (
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
        {trainerNavItems.map((item) => {
          const isActive = pathname === item.href.split("#")[0]

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
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <UserCog className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Trainer Workspace</p>
              <p className="text-xs text-muted-foreground">Check-in, sessions, plans</p>
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
            href="/trainer/login"
            onClick={() => {
              clearTrainerSession()
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
