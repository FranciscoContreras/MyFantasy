import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type GlassTone = "default" | "muted" | "brand"
type GlassSize = "base" | "compact"

interface GlassCardRootProps extends React.ComponentPropsWithoutRef<typeof Card> {
  tone?: GlassTone
  size?: GlassSize
}

const toneMap: Record<GlassTone, string> = {
  default: "bg-white/85 border-white/40 shadow-[0_20px_45px_rgba(0,0,0,0.08)]",
  muted: "bg-white/70 border-slate-200/70 shadow-[0_12px_30px_rgba(148,163,184,0.2)]",
  brand: "bg-white/80 border-indigo-100/70 shadow-[0_20px_45px_rgba(79,70,229,0.25)]",
}

const sizeMap: Record<GlassSize, string> = {
  base: "p-5 sm:p-6 md:p-8",
  compact: "p-4 sm:p-5",
}

const GlassCardRoot = React.forwardRef<HTMLDivElement, GlassCardRootProps>(
  ({ className, tone = "default", size = "base", ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[20px] backdrop-blur-md transition-transform duration-200 ease-out hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/60",
        toneMap[tone],
        sizeMap[size],
        className,
      )}
      {...props}
    />
  ),
)
GlassCardRoot.displayName = "GlassCardRoot"

const GlassCardHeader = ({ className, ...props }: React.ComponentProps<typeof CardHeader>) => (
  <CardHeader className={cn("bg-transparent px-0 pb-0", className)} {...props} />
)

const GlassCardTitle = ({ className, ...props }: React.ComponentProps<typeof CardTitle>) => (
  <CardTitle className={cn("text-foreground/90", className)} {...props} />
)

const GlassCardContent = ({ className, ...props }: React.ComponentProps<typeof CardContent>) => (
  <CardContent className={cn("px-0", className)} {...props} />
)

const GlassCardFooter = ({ className, ...props }: React.ComponentProps<typeof CardFooter>) => (
  <CardFooter className={cn("px-0 pt-0", className)} {...props} />
)

export const GlassCard = Object.assign(GlassCardRoot, {
  Header: GlassCardHeader,
  Title: GlassCardTitle,
  Content: GlassCardContent,
  Footer: GlassCardFooter,
})
