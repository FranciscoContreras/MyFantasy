"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { forgotPasswordSchema } from "@/lib/auth/validators"

export function ForgotPasswordForm() {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = form.handleSubmit((values) => {
    setFeedback(null)
    startTransition(async () => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        setFeedback("We couldn't find that email. Try again.")
        return
      }

      setFeedback("If that email exists, we'll send reset instructions shortly.")
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" placeholder="you@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </Form>
  )
}
