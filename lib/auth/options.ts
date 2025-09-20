import { PrismaAdapter } from "@auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { verifyPassword } from "@/lib/auth/password"

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.CLIENT_KEY ??
  process.env.AUTH_SECRET ??
  process.env.JWT_SECRET ??
  process.env.SECRET

if (!authSecret) {
  const hint =
    process.env.NODE_ENV === "production"
      ? "Set NEXTAUTH_SECRET (or CLIENT_KEY) in your environment variables."
      : "Set NEXTAUTH_SECRET in .env.local."
  throw new Error(`[auth] Missing NextAuth secret. ${hint}`)
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials)
        if (!parsed.success) {
          return null
        }

        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) {
          return null
        }

        const passwordValid = await verifyPassword(password, user.passwordHash)
        if (!passwordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? session.user.id
      }
      return session
    },
  },
}

export default authOptions
