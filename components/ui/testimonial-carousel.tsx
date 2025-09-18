"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { GlassCard } from "@/components/ui/glass-card"

export interface TestimonialItem {
  quote: string
  name: string
  context?: string
}

interface TestimonialCarouselProps {
  items: TestimonialItem[]
  interval?: number
}

export function TestimonialCarousel({ items, interval = 7000 }: TestimonialCarouselProps) {
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const handle = window.setTimeout(() => setActive((prev) => (prev + 1) % items.length), interval)
    return () => window.clearTimeout(handle)
  }, [active, interval, paused, items.length])

  if (!items.length) return null

  const activeItem = items[active]

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="min-h-[260px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GlassCard className="flex flex-col gap-4 bg-white/85 p-8 shadow-[0_20px_45px_rgba(0,0,0,0.08)] dark:bg-slate-900/60">
              <p className="text-lg text-slate-700 dark:text-slate-200">{activeItem.quote}</p>
              <div className="text-sm text-slate-500 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">{activeItem.name}</span>
                {activeItem.context ? <span>{` • ${activeItem.context}`}</span> : null}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`h-2.5 w-8 rounded-full transition-colors ${
              index === active ? "bg-indigo-600" : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500"
            }`}
            aria-label={`Show testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
