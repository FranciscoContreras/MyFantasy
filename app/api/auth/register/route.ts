import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth/password"
import { registerSchema } from "@/lib/auth/validators"

const registerPayloadSchema = registerSchema.omit({ confirmPassword: true })

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = registerPayloadSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const passwordHash = await hashPassword(parsed.data.password)

    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("register error", error)
    return NextResponse.json({ error: "Unable to register" }, { status: 500 })
  }
}
