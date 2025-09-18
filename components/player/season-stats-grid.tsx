import { GlassCard } from "@/components/ui/glass-card"
import type { PlayerSeasonStat } from "@/lib/analysis/player-dashboard"

interface SeasonStatsGridProps {
  stats: PlayerSeasonStat[]
}

export function SeasonStatsGrid({ stats }: SeasonStatsGridProps) {
  return (
    <GlassCard tone="default" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Season snapshot</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Key production metrics with positional ranks.</p>
      </GlassCard.Header>
      <GlassCard.Content>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.category}
              className="rounded-[16px] border border-white/60 bg-white/85 p-3 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">{stat.category}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                {typeof stat.rank === "number" ? (
                  <span className="text-xs text-indigo-500 dark:text-indigo-300">#{stat.rank}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </GlassCard.Content>
    </GlassCard>
  )
}
