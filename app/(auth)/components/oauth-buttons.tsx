"use client"

import { useTransition } from "react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function OAuthButtons() {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-white/60 dark:bg-slate-950/60"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await signIn("google", { callbackUrl: "/dashboard" })
          })
        }
      >
        <span className="mr-2 inline-flex items-center justify-center">
          <Icons.google className="h-4 w-4" />
        </span>
        Continue with Google
      </Button>
    </div>
  )
}
