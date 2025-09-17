import Link from "next/link"

import { AuthCard } from "@/app/(auth)/components/auth-card"
import { RegisterForm } from "@/app/(auth)/components/register-form"

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Connect your leagues and unlock AI recommendations."
    >
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
