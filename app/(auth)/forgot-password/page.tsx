import Link from "next/link"

import { AuthCard } from "@/app/(auth)/components/auth-card"
import { ForgotPasswordForm } from "@/app/(auth)/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="We&apos;ll send a secure link to get you back in the game."
    >
      <ForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        Remembered your credentials?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Return to sign in
        </Link>
      </p>
    </AuthCard>
  )
}
