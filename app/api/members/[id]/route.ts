import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateMemberAccount } from '@/lib/member-auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
    select: {
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
    },
  });

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  return NextResponse.json(member);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const memberId = Number(id);
    const currentMember = await prisma.member.findUnique({
      where: { id: memberId },
      select: { attendanceCount: true },
    });
    const member = await updateMemberAccount(memberId, {
      username: body.username ?? body.name,
      phone: body.phone,
      password: body.password,
      role: body.role,
      membershipStatus: body.membershipStatus,
      attendanceCount: body.attendanceCount !== undefined ? Number(body.attendanceCount) : undefined,
      caloriesBurned: body.caloriesBurned !== undefined ? Number(body.caloriesBurned) : undefined,
    });

    if (body.attendanceCount !== undefined && Number(body.attendanceCount) > (currentMember?.attendanceCount ?? 0)) {
      const today = new Date().toISOString().slice(0, 10);
      await prisma.attendance.upsert({
        where: { memberId_date: { memberId, date: today } },
        update: { present: true, checkedInAt: new Date() },
        create: { memberId, date: today, present: true, checkedInAt: new Date() },
      });
    }

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to update member' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.member.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 400 });
  }
}
