import "server-only"

import { prisma } from "@/lib/prisma"
import { buildMemberEmail, hashPassword, normalizePhone, normalizeUsername, verifyPassword } from "@/lib/auth-password"
import { memberSessionSelect } from "@/lib/member-auth"

const DEFAULT_ADMIN = {
  name: "Anjaney",
  phone: "1234",
  password: "264",
  email: "anjaney@gym.local",
}

export async function ensureDefaultAdminAccount() {
  const phone = normalizePhone(DEFAULT_ADMIN.phone)
  const name = DEFAULT_ADMIN.name
  const email = DEFAULT_ADMIN.email

  const existing = await prisma.member.findFirst({
    where: {
      OR: [{ phone }, { email }],
    },
    select: { id: true },
  })

  if (existing) {
    await prisma.member.update({
      where: { id: existing.id },
      data: {
        name,
        phone,
        email,
        password: hashPassword(DEFAULT_ADMIN.password),
        role: "admin",
        membershipStatus: "Active",
        membershipExpiresAt: null,
      },
    })
    return prisma.member.findUnique({
      where: { id: existing.id },
      select: memberSessionSelect,
    })
  }

  let candidateEmail = buildMemberEmail(name)
  let suffix = 1
  while (await prisma.member.findUnique({ where: { email: candidateEmail } })) {
    candidateEmail = buildMemberEmail(name, suffix++)
  }

  return prisma.member.create({
    data: {
      name,
      email: candidateEmail,
      phone,
      password: hashPassword(DEFAULT_ADMIN.password),
      role: "admin",
      membershipStatus: "Active",
    },
    select: memberSessionSelect,
  })
}

export async function authenticateAdmin(input: {
  username?: string
  phone?: string
  password: string
}) {
  const username = input.username ? normalizeUsername(input.username) : ""
  const phone = input.phone ? normalizePhone(input.phone) : ""

  const conditions: Array<Record<string, unknown>> = []
  if (username) conditions.push({ name: { equals: username, mode: "insensitive" } })
  if (phone) conditions.push({ phone })

  const where = conditions.length === 2 ? { AND: conditions } : conditions[0]
  const admin = await prisma.member.findFirst({
    where,
    select: { ...memberSessionSelect, password: true },
  })

  if (!admin || admin.role !== "admin") return null
  if (!admin.password || !verifyPassword(input.password, admin.password)) return null

  return admin
}
