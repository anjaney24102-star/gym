"use client"

export const AUTH_SESSION_KEY = "titan-member-session"

export interface AuthSessionMember {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  membershipStatus: string
  attendanceCount: number
  caloriesBurned: number
  createdAt?: string
  updatedAt?: string
  membershipExpiresAt?: string | null
}

const hasWindow = () => typeof window !== "undefined"

export function saveAuthSession(member: AuthSessionMember) {
  if (!hasWindow()) return
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(member))
}

export function readAuthSession() {
  if (!hasWindow()) return null

  const raw = window.localStorage.getItem(AUTH_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSessionMember
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY)
    return null
  }
}

export function clearAuthSession() {
  if (!hasWindow()) return
  window.localStorage.removeItem(AUTH_SESSION_KEY)
}
