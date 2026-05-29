import { NextResponse } from "next/server"
import { authenticateAdmin, ensureDefaultAdminAccount } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    await ensureDefaultAdminAccount()

    const body = await request.json()
    const username = String(body.username ?? body.name ?? "").trim()
    const phone = String(body.phone ?? "").trim()
    const password = String(body.password ?? "")

    if (!password || (!username && !phone)) {
      return NextResponse.json({ error: "Name or phone and password are required." }, { status: 400 })
    }

    const admin = await authenticateAdmin({ username, phone, password })

    if (!admin) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 })
    }

    const { password: _password, ...adminSession } = admin

    return NextResponse.json({
      success: true,
      redirectTo: "/admin",
      admin: adminSession,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign in." }, { status: 400 })
  }
}
