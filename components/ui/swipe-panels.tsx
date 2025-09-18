"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SwipePanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  panelClassName?: string
}

const defaultPanelClass = "min-w-[calc(100vw-5rem)] sm:min-w-[360px] md:min-w-0"

export const SwipePanels = React.forwardRef<HTMLDivElement, SwipePanelsProps>(
  ({ children, className, panelClassName, ...props }, ref) => {
    const panels = React.Children.toArray(children).map((child, index) => (
      <div
        key={index}
        className={cn("snap-start", defaultPanelClass, panelClassName)}
      >
        {child}
      </div>
    ))

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full gap-4 overflow-x-auto pb-4 -mx-6 px-6 touch-pan-x snap-x snap-mandatory scroll-smooth md:mx-0 md:grid md:auto-rows-fr md:gap-6 md:overflow-visible md:px-0 md:pb-0",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        {...props}
      >
        {panels}
      </div>
    )
  },
)
SwipePanels.displayName = "SwipePanels"
