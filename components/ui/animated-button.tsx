import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

type AnimatedButtonVariant = "primary" | "secondary" | "ghost"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AnimatedButtonVariant
  loading?: boolean
  asChild?: boolean
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, variant = "primary", loading = false, disabled, asChild = false, ...props }, ref) => {
    const shared = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

    const variants: Record<AnimatedButtonVariant, string> = {
      primary:
        "bg-primary text-primary-foreground shadow-[0_20px_45px_rgba(79,70,229,0.25)] hover:bg-[color:var(--primary-hover)]",
      secondary:
        "bg-white/85 text-slate-700 border border-white/60 shadow-[0_12px_30px_rgba(148,163,184,0.25)] hover:bg-white",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200",
    }

    if (asChild) {
      return (
        <Slot
          className={cn(
            "group relative overflow-hidden",
            shared,
            variants[variant],
            "hover:-translate-y-0.5 active:scale-[0.98]",
            loading ? "cursor-wait opacity-70" : "",
            className,
          )}
          {...props}
        >
          {loading ? (
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" aria-hidden />
          ) : null}
          <span className={cn("relative z-10", loading ? "opacity-0" : "")}>{children}</span>
          <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(120deg, rgba(79,70,229,0.2), rgba(14,165,233,0.15))" }} />
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(
          "group relative overflow-hidden",
          shared,
          variants[variant],
          "hover:-translate-y-0.5 active:scale-[0.98]",
          loading ? "cursor-wait opacity-70" : "",
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" aria-hidden />
        ) : null}
        <span className={cn("relative z-10", loading ? "opacity-0" : "")}>{children}</span>
        <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(120deg, rgba(79,70,229,0.2), rgba(14,165,233,0.15))" }} />
      </button>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"
