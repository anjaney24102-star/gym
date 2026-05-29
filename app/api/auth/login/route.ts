import { NextResponse } from 'next/server';
import { authenticateMember } from '@/lib/member-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const password = String(body.password ?? '');

    if (!password || (!username && !phone)) {
      return NextResponse.json({ error: 'Username or phone and password are required.' }, { status: 400 });
    }

    const member = await authenticateMember({ username, phone, password });

    if (!member) {
      return NextResponse.json({ error: 'Invalid username, phone, or password.' }, { status: 401 });
    }

    const { password: _password, ...memberSession } = member;

    return NextResponse.json({
      success: true,
      redirectTo: '/member/dashboard',
      member: memberSession,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sign in.' }, { status: 400 });
  }
}
