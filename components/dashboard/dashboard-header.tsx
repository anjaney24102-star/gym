"use client"

import { motion } from "framer-motion"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { memberData } from "@/lib/dashboard-data"
import { readAuthSession } from "@/lib/auth-session"

export type DashboardNotification = {
  id: number
  message: string
  time: string
  read: boolean
}

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  notifications?: DashboardNotification[]
}

export function DashboardHeader({ title, subtitle, onMenuClick, notifications }: DashboardHeaderProps) {
  const session = readAuthSession()
  const expiryNotice =
    session?.role === "member" && session.membershipExpiresAt
      ? (() => {
          const expiryDate = new Date(session.membershipExpiresAt)
          const today = new Date()
          const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          if (daysRemaining > 10) return null

          return {
            id: -1,
            message:
              daysRemaining < 0
                ? "Your membership has expired. Please renew it today."
                : `Your membership expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}. Please renew soon.`,
            time: "Now",
            read: false,
          }
        })()
      : null

  const baseItems = notifications ?? memberData.notifications
  const items = expiryNotice ? [expiryNotice, ...baseItems] : baseItems
  const unreadNotifications = items.filter((n) => !n.read).length

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-10 bg-muted/50 border-border"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 w-full">
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <span className="text-sm text-foreground">{notification.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
