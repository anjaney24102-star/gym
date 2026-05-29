"use client"

export const TRAINER_SESSION_KEY = "titan-trainer-session"

export interface TrainerSession {
  id: number
  name: string
  email: string
  phone: string | null
  specialization: string
  role: string
  checkInTime?: string
  checkOutTime?: string
  totalWorkingHours?: number
  todaySessions?: number
}

const hasWindow = () => typeof window !== "undefined"

export function saveTrainerSession(session: TrainerSession) {
  if (!hasWindow()) return
  window.localStorage.setItem(TRAINER_SESSION_KEY, JSON.stringify(session))
}

export function readTrainerSession() {
  if (!hasWindow()) return null

  const raw = window.localStorage.getItem(TRAINER_SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as TrainerSession
  } catch {
    window.localStorage.removeItem(TRAINER_SESSION_KEY)
    return null
  }
}

export function clearTrainerSession() {
  if (!hasWindow()) return
  window.localStorage.removeItem(TRAINER_SESSION_KEY)
}
