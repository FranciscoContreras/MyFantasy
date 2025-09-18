import { FadeIn } from "@/components/motion/fade-in"
import { StatsStrip } from "@/components/ui/stats-strip"

const metrics = [
  { label: "Average weekly lift", value: "+12%", caption: "Across synced leagues" },
  { label: "Time saved", value: "3x faster", caption: "Start/sit decisions" },
  { label: "Retention", value: "95%", caption: "Season-over-season subscribers" },
]

export function OutcomesSection() {
  return (
    <section className="py-16">
      <FadeIn className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
          Outcomes that move the standings.
        </h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Every lineup suggestion blends projections, matchup context, and plain-language reasoning so you can act in seconds.
        </p>
        <StatsStrip items={metrics} className="w-full" />
      </FadeIn>
    </section>
  )
}
