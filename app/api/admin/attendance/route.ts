import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const now = new Date();
    const today = formatDate(now);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const tenDaysFromNow = new Date(now);
    tenDaysFromNow.setDate(now.getDate() + 10);

    const [dailyCount, weeklyCount, monthlyCount, allMembers, allMembersRaw] = await Promise.all([
      prisma.attendance.count({ where: { date: today } }),
      prisma.attendance.count({ where: { date: { gte: formatDate(weekStart), lte: today } } }),
      prisma.attendance.count({ where: { date: { gte: formatDate(monthStart), lte: today } } }),
      prisma.member.findMany({
        orderBy: [{ attendanceCount: 'desc' }, { createdAt: 'asc' }],
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          membershipStatus: true,
          attendanceCount: true,
          createdAt: true,
          _count: { select: { attendance: true } },
        },
      }),
      prisma.member.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          membershipStatus: true,
          createdAt: true,
          membershipExpiresAt: true,
        },
      }),
    ]);

    const expiringSoon = allMembersRaw
      .map((member) => {
        const expiryDate = member.membershipExpiresAt ?? new Date(member.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
        return {
          ...member,
          expiryDate,
        };
      })
      .filter((member) => {
        const expiryDate = member.expiryDate;
        return expiryDate >= now && expiryDate <= tenDaysFromNow;
      })
      .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());

    return NextResponse.json({
      overview: {
        daily: dailyCount,
        weekly: weeklyCount,
        monthly: monthlyCount,
      },
      members: allMembers.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipStatus: member.membershipStatus,
        attendanceCount: member.attendanceCount,
        attendanceDays: member._count.attendance,
        joinedAt: member.createdAt,
      })),
      expiringSoon,
    });
  } catch (error) {
    console.error('Admin attendance summary failed:', error);
    return NextResponse.json({ error: 'Failed to load attendance data.' }, { status: 500 });
  }
}
