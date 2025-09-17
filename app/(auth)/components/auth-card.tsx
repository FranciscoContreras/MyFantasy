import type { PropsWithChildren } from "react"

import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface AuthCardProps extends PropsWithChildren {
  title: string
  description?: string
  className?: string
}

export function AuthCard({ title, description, className, children }: AuthCardProps) {
  return (
    <GlassCard className={cn("w-full max-w-md space-y-6", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-foreground/90">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </GlassCard>
  )
}
