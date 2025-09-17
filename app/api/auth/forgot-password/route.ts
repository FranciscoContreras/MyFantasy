import { NextResponse } from "next/server"

import { forgotPasswordSchema } from "@/lib/auth/validators"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = forgotPasswordSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // TODO: integrate email service and token issuance
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("forgot-password error", error)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
