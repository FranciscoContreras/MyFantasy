"use client"

import * as React from "react"
import { Quote } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"

const testimonials = [
  {
    name: "Alex Ramirez",
    role: "Back-to-back Champion",
    quote: "The optimizer called two boom plays before kick-off. Glass dashboards made every decision effortless.",
  },
  {
    name: "Priya Desai",
    role: "DFS Finalist",
    quote: "Being able to stack scenarios with projected margins gave me the highest ROI week I have ever had.",
  },
  {
    name: "Jordan Li",
    role: "League Commissioner",
    quote: "Playwright imports saved hours of manual entry. AI insights keep everyone glued to the league chat.",
  },
]

export function LandingTestimonials() {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_60%),radial-gradient(circle_at_top_left,_rgba(125,211,252,0.2),_transparent_55%)]" />
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-500 dark:text-sky-300">
          Loved by fantasy managers everywhere
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Transparent insights. Real results.</h2>
        <div className="relative mt-12 flex min-h-[320px] items-stretch justify-center">
          {testimonials.map((testimonial, testimonialIndex) => {
            const isActive = index === testimonialIndex
            return (
              <GlassCard
                key={testimonial.name}
                className={"absolute inset-0 mx-auto flex max-w-3xl flex-col gap-6 border-white/40 bg-white/70 p-10 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.55)] transition-all duration-700 ease-out dark:border-white/10 dark:bg-slate-900/60" + (isActive ? " opacity-100 scale-100" : " pointer-events-none scale-95 opacity-0")}
              >
                <Quote className="h-10 w-10 text-sky-400" />
                <p className="text-lg text-slate-700 dark:text-slate-200">
                  {testimonial.quote}
                </p>
                <div className="space-y-1 text-sm text-slate-500 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p>{testimonial.role}</p>
                </div>
              </GlassCard>
            )
          })}
        </div>
        <div className="mt-16 flex justify-center gap-3">
          {testimonials.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 w-8 rounded-full transition-all ${
                index === dotIndex ? "bg-sky-500" : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500"
              }`}
              aria-label={`Show testimonial ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
