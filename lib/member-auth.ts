import "server-only"

import { prisma } from "@/lib/prisma"
import {
  buildMemberEmail,
  hashPassword,
  normalizePhone,
  normalizeUsername,
  slugifyUsername,
  verifyPassword,
} from "@/lib/auth-password"

export const memberSessionSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  membershipStatus: true,
  attendanceCount: true,
  caloriesBurned: true,
  createdAt: true,
  updatedAt: true,
  membershipExpiresAt: true,
} as const

export type MemberSession = Awaited<
  ReturnType<typeof buildMemberSession>
>

export async function buildMemberSession(memberId: number) {
  return prisma.member.findUnique({
    where: { id: memberId },
    select: memberSessionSelect,
  })
}

export async function findMemberByCredentials(input: {
  username?: string
  phone?: string
}) {
  const username = input.username ? normalizeUsername(input.username) : ""
  const phone = input.phone ? normalizePhone(input.phone) : ""

  if (!username && !phone) return null

  const conditions: Array<Record<string, unknown>> = []

  if (username) {
    conditions.push({ name: { equals: username, mode: "insensitive" } })
  }

  if (phone) {
    conditions.push({ phone })
  }

  const where = conditions.length === 2 ? { AND: conditions } : conditions[0]

  return prisma.member.findFirst({
    where,
    select: { ...memberSessionSelect, password: true },
  })
}

export async function ensureUniqueMemberIdentity(input: {
  username: string
  phone: string
  excludeId?: number
}) {
  const username = normalizeUsername(input.username)
  const phone = normalizePhone(input.phone)

  const existingUsername = await prisma.member.findFirst({
    where: {
      ...(input.excludeId ? { id: { not: input.excludeId } } : {}),
      name: username,
    },
    select: { id: true },
  })

  if (existingUsername) {
    throw new Error("A member with this username already exists.")
  }

  if (phone) {
    const existingPhone = await prisma.member.findFirst({
      where: {
        ...(input.excludeId ? { id: { not: input.excludeId } } : {}),
        phone,
      },
      select: { id: true },
    })

    if (existingPhone) {
      throw new Error("A member with this phone number already exists.")
    }
  }

  return { username, phone }
}

export async function createMemberAccount(input: {
  username: string
  phone: string
  password: string
}) {
  const { username, phone } = await ensureUniqueMemberIdentity(input)

  let email = buildMemberEmail(username)
  let suffix = 1

  while (await prisma.member.findUnique({ where: { email } })) {
    email = buildMemberEmail(username, suffix++)
  }

  return prisma.member.create({
    data: {
      name: username,
      email,
      phone,
      password: hashPassword(input.password),
      role: "member",
      membershipStatus: "Active",
      membershipExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      attendanceCount: 0,
      caloriesBurned: 0,
    },
    select: memberSessionSelect,
  })
}

export async function authenticateMember(input: {
  username?: string
  phone?: string
  password: string
}) {
  const member = await findMemberByCredentials({
    username: input.username,
    phone: input.phone,
  })

  if (!member?.password) return null

  const isValid = verifyPassword(input.password, member.password)
  if (!isValid) return null

  if (!member.password.startsWith("scrypt$")) {
    await prisma.member.update({
      where: { id: member.id },
      data: { password: hashPassword(input.password) },
    })
  }

  return member
}

export async function updateMemberAccount(
  memberId: number,
  input: {
    username?: string
    phone?: string | null
    password?: string
    role?: string
    membershipStatus?: string
    attendanceCount?: number
    caloriesBurned?: number
  }
) {
  const data: Record<string, unknown> = {}

  if (input.username !== undefined) {
    data.name = normalizeUsername(input.username)
  }

  if (input.phone !== undefined) {
    data.phone = input.phone === null ? null : normalizePhone(input.phone)
  }

  if (input.password !== undefined) {
    data.password = hashPassword(input.password)
  }

  if (input.role !== undefined) {
    data.role = input.role.trim().toLowerCase()
  }

  if (input.membershipStatus !== undefined) {
    data.membershipStatus = input.membershipStatus.trim()
  }

  if (input.attendanceCount !== undefined) {
    data.attendanceCount = input.attendanceCount
  }

  if (input.caloriesBurned !== undefined) {
    data.caloriesBurned = input.caloriesBurned
  }

  if (input.username !== undefined || input.phone !== undefined) {
    await ensureUniqueMemberIdentity({
      username: input.username ?? (await prisma.member.findUnique({ where: { id: memberId }, select: { name: true } }))?.name ?? "",
      phone: input.phone === undefined ? (await prisma.member.findUnique({ where: { id: memberId }, select: { phone: true } }))?.phone ?? "" : input.phone ?? "",
      excludeId: memberId,
    })
  }

  return prisma.member.update({
    where: { id: memberId },
    data,
    select: memberSessionSelect,
  })
}
