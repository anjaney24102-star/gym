import "server-only"

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const PASSWORD_PREFIX = "scrypt"

export function normalizeUsername(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

export function normalizePhone(value: string) {
  return value.trim().replace(/[^\d+]/g, "")
}

export function slugifyUsername(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40)

  return slug || "member"
}

export function buildMemberEmail(username: string, fallbackIndex = 0) {
  const slug = slugifyUsername(username)
  return fallbackIndex > 0
    ? `${slug}${fallbackIndex}@gym.local`
    : `${slug}@gym.local`
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${PASSWORD_PREFIX}$${salt}$${hash}`
}

export function verifyPassword(password: string, storedPassword: string | null | undefined) {
  if (!storedPassword) return false

  if (!storedPassword.startsWith(`${PASSWORD_PREFIX}$`)) {
    return password === storedPassword
  }

  const [, salt, expectedHash] = storedPassword.split("$")
  if (!salt || !expectedHash) return false

  const candidateHash = scryptSync(password, salt, 64).toString("hex")
  const expected = Buffer.from(expectedHash, "hex")
  const candidate = Buffer.from(candidateHash, "hex")

  if (expected.length !== candidate.length) return false

  return timingSafeEqual(expected, candidate)
}
