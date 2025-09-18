import { PlayerProjectionCard } from "@/components/projections/player-projection-card"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { getSampleProjectionsDashboard } from "@/lib/analysis/projections-dashboard"

export default async function ProjectionsDashboardPage() {
  const projections = getSampleProjectionsDashboard()

  const aggregate = projections.players.reduce(
    (acc, player) => {
      acc.mean += player.mean
      acc.floor += player.floor
      acc.ceiling += player.ceiling
      acc.boom += player.boomProbability
      acc.bust += player.bustProbability
      return acc
    },
    { mean: 0, floor: 0, ceiling: 0, boom: 0, bust: 0 },
  )

  const count = projections.players.length || 1
  const averageMean = aggregate.mean / count
  const averageFloor = aggregate.floor / count
  const averageCeiling = aggregate.ceiling / count
  const averageBoom = aggregate.boom / count
  const averageBust = aggregate.bust / count

  const topUpside = projections.players.length
    ? projections.players.reduce((prev, current) => (current.ceiling > prev.ceiling ? current : prev))
    : null

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Projections</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Rest-of-week outlook</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Track weekly point ranges, boom/bust probabilities, and target share shifts. Numbers update as the prediction engine ingests new injury reports and matchup volatility.
        </p>
      </section>
      <GlassCard tone="muted" className="grid gap-6 lg:grid-cols-4">
        <SummaryStat label="Avg projection" value={`${averageMean.toFixed(1)} pts`} detail={`Floor ${averageFloor.toFixed(1)} • Ceiling ${averageCeiling.toFixed(1)}`} />
        <SummaryStat label="Boom probability" value={`${Math.round(averageBoom * 100)}%`} detail="Across monitored starters" badgeTone="positive" />
        <SummaryStat label="Bust probability" value={`${Math.round(averageBust * 100)}%`} detail="Risk of sub-80% outcome" badgeTone="negative" />
        <SummaryStat
          label="Top ceiling"
          value={topUpside ? `${topUpside.ceiling.toFixed(1)} pts` : "—"}
          detail={topUpside ? `${topUpside.name} (${topUpside.position})` : "Awaiting projection data"}
          badgeTone="accent"
        />
      </GlassCard>
      <section className="grid gap-6 xl:grid-cols-2">
        {projections.players.map((player) => (
          <PlayerProjectionCard key={player.id} player={player} />
        ))}
      </section>
    </div>
  )
}

function SummaryStat({
  label,
  value,
  detail,
  badgeTone = "neutral",
}: {
  label: string
  value: string
  detail: string
  badgeTone?: "neutral" | "positive" | "negative" | "accent"
}) {
  const toneClass = {
    neutral: "border-transparent bg-white/85 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
    positive: "border-transparent bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    negative: "border-transparent bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
    accent: "border-transparent bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
  }[badgeTone]

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</span>
        <Badge className={toneClass}>{label}</Badge>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </div>
  )
}
