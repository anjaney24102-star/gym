import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMemberAccount, ensureUniqueMemberIdentity } from '@/lib/member-auth';
import { buildMemberEmail } from '@/lib/auth-password';

export async function GET() {
  const members = await prisma.member.findMany({
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
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(members);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? body.name ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const password = String(body.password ?? '');

    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    await ensureUniqueMemberIdentity({ username, phone });

    if (password) {
      const member = await createMemberAccount({ username, phone, password });
      return NextResponse.json(member, { status: 201 });
    }

    let email = buildMemberEmail(username);
    let suffix = 1;
    while (await prisma.member.findUnique({ where: { email } })) {
      email = buildMemberEmail(username, suffix++);
    }

    const member = await prisma.member.create({
      data: {
        name: username,
        email,
        phone: phone || null,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create member' },
      { status: 400 }
    );
  }
}
