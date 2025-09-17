import * as React from "react"

import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          variant === "primary"
            ? "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white shadow-[0_20px_45px_-20px_rgba(56,189,248,0.75)] hover:shadow-[0_25px_70px_-25px_rgba(37,99,235,0.75)]"
            : "bg-white/80 text-slate-900 border border-white/40 backdrop-blur hover:bg-white/90 dark:text-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900/80",
          className,
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {variant === "primary" ? (
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-400/40 via-blue-500/30 to-indigo-500/40 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
        ) : null}
      </button>
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"
