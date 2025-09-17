import { Suspense } from "react"
import Link from "next/link"

import { AuthCard } from "@/app/(auth)/components/auth-card"
import { LoginForm } from "@/app/(auth)/components/login-form"

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to analyze your league in real time."
    >
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading sign in form...</div>}>
        <LoginForm />
      </Suspense>
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/forgot-password" className="hover:underline">
            Forgot your password?
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
