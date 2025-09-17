import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type GlassCardRootProps = React.ComponentPropsWithoutRef<typeof Card>

const GlassCardRoot = React.forwardRef<HTMLDivElement, GlassCardRootProps>(
  ({ className, ...props }, ref) => (
    <Card ref={ref} className={cn("glass-card soft-shadow", className)} {...props} />
  ),
)
GlassCardRoot.displayName = "GlassCardRoot"

const GlassCardHeader = ({ className, ...props }: React.ComponentProps<typeof CardHeader>) => (
  <CardHeader className={cn("glass bg-transparent", className)} {...props} />
)

const GlassCardTitle = ({ className, ...props }: React.ComponentProps<typeof CardTitle>) => (
  <CardTitle className={cn("text-foreground/90", className)} {...props} />
)

const GlassCardContent = ({ className, ...props }: React.ComponentProps<typeof CardContent>) => (
  <CardContent className={cn("glass bg-transparent", className)} {...props} />
)

const GlassCardFooter = ({ className, ...props }: React.ComponentProps<typeof CardFooter>) => (
  <CardFooter className={cn("glass bg-transparent", className)} {...props} />
)

export const GlassCard = Object.assign(GlassCardRoot, {
  Header: GlassCardHeader,
  Title: GlassCardTitle,
  Content: GlassCardContent,
  Footer: GlassCardFooter,
})
