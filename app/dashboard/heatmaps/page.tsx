import { HeatmapGrid } from "@/components/heatmaps/heatmap-grid"
import { GlassCard } from "@/components/ui/glass-card"
import { SwipePanels } from "@/components/ui/swipe-panels"
import { getSampleHeatmapDashboard } from "@/lib/analysis/heatmap-dashboard"

export default async function HeatmapDashboardPage() {
  const data = getSampleHeatmapDashboard()

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Heat maps</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Visual matchup matrix</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Spot favorable matchups, positional strengths, and trade targets at a glance. Cells are colored from cool (favorable) to warm (difficult).
        </p>
      </section>
      <GlassCard tone="default" className="space-y-4">
        <GlassCard.Header className="space-y-1">
          <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Matchup difficulty</GlassCard.Title>
          <p className="text-sm text-slate-600 dark:text-slate-300">Defense vs position scores for upcoming opponents.</p>
        </GlassCard.Header>
        <GlassCard.Content>
          <HeatmapGrid dataset={data.matchupDifficulty} min={20} max={80} />
        </GlassCard.Content>
      </GlassCard>
      <GlassCard tone="muted" className="space-y-4">
        <GlassCard.Header className="space-y-1">
          <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Position strength</GlassCard.Title>
          <p className="text-sm text-slate-600 dark:text-slate-300">Composite scores by usage, efficiency, and leverage.</p>
        </GlassCard.Header>
        <GlassCard.Content>
          <HeatmapGrid dataset={data.positionStrength} min={30} max={70} />
        </GlassCard.Content>
      </GlassCard>
      <SwipePanels aria-label="Projection and trade heatmaps" className="md:grid-cols-1 lg:grid-cols-2">
        <GlassCard tone="default" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Weekly projections</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Expected points per position over the next five weeks.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <HeatmapGrid dataset={data.weeklyProjections} min={10} max={25} />
          </GlassCard.Content>
        </GlassCard>
        <GlassCard tone="muted" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Trade values</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Relative trade metrics for priority targets.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <HeatmapGrid dataset={data.tradeValues} min={50} max={100} />
          </GlassCard.Content>
        </GlassCard>
      </SwipePanels>
    </div>
  )
}
