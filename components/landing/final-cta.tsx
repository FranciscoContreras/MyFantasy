import Link from "next/link"

import { FadeIn } from "@/components/motion/fade-in"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"

export function FinalCTASection() {
  return (
    <section className="py-24">
      <FadeIn className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Ready to own Sunday?
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Keep your lineup ahead of the league with synced data, matchup-aware projections, and the fastest optimizer we can build.
          </p>
        </div>
        <GlassCard tone="brand" className="space-y-6">
          <div className="grid gap-4 text-left text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
            {["Sync every league in under a minute.", "Compare floor, ceiling, and confidence without tab hopping.", "Lock lineups and track results automatically."].map((bullet) => (
              <p key={bullet} className="rounded-[18px] border border-white/60 bg-white/85 p-4 font-medium shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
                {bullet}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/optimize" className="inline-flex">
              <AnimatedButton>Try the optimizer</AnimatedButton>
            </Link>
            <Link href="/import" className="inline-flex">
              <AnimatedButton variant="secondary">Import a league</AnimatedButton>
            </Link>
          </div>
        </GlassCard>
      </FadeIn>
    </section>
  )
}
