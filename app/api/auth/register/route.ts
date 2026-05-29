import { NextResponse } from 'next/server';
import { createMemberAccount } from '@/lib/member-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? body.name ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const password = String(body.password ?? '');

    if (!username || !phone || !password) {
      return NextResponse.json({ error: 'Username, phone number, and password are required.' }, { status: 400 });
    }

    const member = await createMemberAccount({ username, phone, password });

    return NextResponse.json({
      success: true,
      redirectTo: '/member/dashboard',
      member,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create account.'

    if (message.includes('username already exists') || message.includes('phone number already exists')) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
