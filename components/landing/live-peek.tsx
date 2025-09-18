import Link from "next/link"

import { FadeIn } from "@/components/motion/fade-in"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"
import type { HomeSpotlightPayload } from "@/lib/landing/get-home-spotlight"

interface LiveProductPeekProps {
  spotlight: HomeSpotlightPayload
}

export function LiveProductPeek({ spotlight }: LiveProductPeekProps) {
  const primary = spotlight.players[0]
  const secondary = spotlight.players.slice(1)
  const weekLabel = spotlight.week ? `Week ${spotlight.week}` : "Latest week"

  return (
    <section className="py-20">
      <FadeIn className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6 text-left">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            See the optimizer before kickoff.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The Start or Sit workspace shows live fantasy points, matchup context, and usage so you can commit to a lineup in seconds.
          </p>
          <Link href="/optimize" className="inline-flex">
            <AnimatedButton>Run a sample slate</AnimatedButton>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {spotlight.dataset === "live" ? "Pulled from the latest completed week." : "Sample data displayed until live feeds are connected."}
          </p>
        </div>
        <FadeIn delay={0.08} className="relative">
          <GlassCard tone="brand" className="flex flex-col gap-6 p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">{weekLabel} spotlight</p>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {primary ? `${primary.name} · ${primary.team}` : "Sync a league to view player notes"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {primary ? primary.summary : "As soon as a league is connected we surface player usage, opponent context, and projections in one glass view."}
              </p>
            </div>
            {primary ? (
              <div className="grid gap-4 rounded-[18px] border border-white/50 bg-white/85 p-6 shadow-inner dark:border-white/10 dark:bg-slate-900/70">
                <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <p className="font-medium text-slate-900 dark:text-white">Key metrics</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {primary.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-[16px] border border-white/60 bg-white/90 p-4 text-center text-slate-700 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
                      >
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{metric.label}</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {secondary.length ? (
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <p className="font-medium text-slate-900 dark:text-white">Other standouts</p>
                    <ul className="space-y-2">
                      {secondary.map((player) => (
                        <li key={player.id} className="flex items-center justify-between rounded-[16px] border border-white/55 bg-white/85 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                          <span className="text-slate-700 dark:text-slate-200">{player.name}</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {player.fantasyPoints !== null ? `${player.fantasyPoints.toFixed(1)} pts` : "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-white/60 bg-white/80 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                Connect a league to populate live matchup notes and confidence scores automatically.
              </div>
            )}
          </GlassCard>
        </FadeIn>
      </FadeIn>
    </section>
  )
}
