"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

import { FadeIn } from "@/components/motion/fade-in"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"
import { StatsStrip } from "@/components/ui/stats-strip"
import type { HomeSpotlightPayload } from "@/lib/landing/get-home-spotlight"

const stats = [
  { label: "Average lift", value: "+12%", caption: "Weekly fantasy points" },
  { label: "Decision time", value: "3x faster", caption: "Start or sit calls" },
  { label: "Satisfaction", value: "95%", caption: "Managers who stay subscribed" },
]

interface HeroSectionProps {
  spotlight: HomeSpotlightPayload
}

export function HeroSection({ spotlight }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const primary = spotlight.players[0]
  const metrics = primary?.metrics ?? []
  const weekLabel = spotlight.week ? `Week ${spotlight.week}` : "Latest week"
  const lastUpdated = formatUpdatedLabel(spotlight.updatedAt)

  return (
    <section className="overflow-hidden py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <FadeIn className="flex flex-col gap-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300 lg:justify-start">
            Lineup intelligence
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Win smarter every week.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl dark:text-slate-300">
              Real-time analysis you can act on. Start or sit guidance with confidence. One-click imports from ESPN, Yahoo, Sleeper, and CBS keep every lineup current.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href="/optimize" className="inline-flex">
              <AnimatedButton>Try the optimizer</AnimatedButton>
            </Link>
            <Link href="/import" className="inline-flex">
              <AnimatedButton variant="secondary">Import your league</AnimatedButton>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-300 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow dark:bg-slate-900/70">
              Trusted by 2,800+ fantasy managers
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow dark:bg-slate-900/70">
              Imports • Matchup context • Optimizer wins
            </span>
          </div>
          <StatsStrip items={stats} className="mt-4" />
        </FadeIn>
        <FadeIn delay={0.1} className="relative">
          <motion.div
            className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-indigo-200/40 blur-3xl"
            animate={prefersReducedMotion ? undefined : { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
            transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <GlassCard tone="brand" className="relative flex h-full flex-col gap-6 overflow-hidden p-8 md:p-10">
            <div className="space-y-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:text-indigo-300">{weekLabel} spotlight</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {primary ? `${primary.name} · ${primary.team}` : "Player spotlight unavailable"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {primary ? primary.summary : "We refresh the latest week automatically as soon as games finish."}
              </p>
              {primary ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">Opponent: {primary.opponent}</p>
              ) : null}
            </div>
            <div className="grid gap-4 rounded-[18px] border border-white/60 bg-white/85 p-6 shadow-inner dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Latest results</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                  {primary ? weekLabel : "Auto sync"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {(metrics.length ? metrics.slice(0, 3) : fallbackMetrics(primary)).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[16px] bg-white py-4 text-slate-700 shadow-inner shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-slate-900/80 dark:text-slate-200"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Updated {lastUpdated}</span>
                <span>{spotlight.dataset === "live" ? "Live pull" : "Sample data"}</span>
              </div>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  )
}

function fallbackMetrics(primary?: HomeSpotlightPayload["players"][number]) {
  if (!primary) {
    return [
      { label: "Fantasy points", value: "—" },
      { label: "Targets", value: "—" },
      { label: "Red zone looks", value: "—" },
    ]
  }

  if (primary.metrics.length) {
    return primary.metrics
  }

  return [
    { label: "Fantasy points", value: primary.fantasyPoints ? `${primary.fantasyPoints.toFixed(1)} pts` : "—" },
    { label: "Team", value: primary.team },
    { label: "Opponent", value: primary.opponent },
  ]
}

function formatUpdatedLabel(updatedAt: string) {
  const date = new Date(updatedAt)
  if (Number.isNaN(date.getTime())) {
    return "just now"
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
