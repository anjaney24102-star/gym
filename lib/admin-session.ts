"use client"

export const ADMIN_SESSION_KEY = "titan-admin-session"

export interface AdminSession {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  membershipStatus: string
  attendanceCount: number
  caloriesBurned: number
  membershipExpiresAt?: string | null
}

const hasWindow = () => typeof window !== "undefined"

export function saveAdminSession(admin: AdminSession) {
  if (!hasWindow()) return
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin))
}

export function readAdminSession() {
  if (!hasWindow()) return null

  const raw = window.localStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AdminSession
  } catch {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    return null
  }
}

export function clearAdminSession() {
  if (!hasWindow()) return
  window.localStorage.removeItem(ADMIN_SESSION_KEY)
}
