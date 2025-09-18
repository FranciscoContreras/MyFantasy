import { SeasonTrendChart } from "@/components/performance/season-trend-chart"
import { PointsDistributionChart } from "@/components/performance/points-distribution-chart"
import { MatchupHistoryChart } from "@/components/performance/matchup-history-chart"
import { PositionPerformanceChart } from "@/components/performance/position-performance-chart"
import { TeamComparisonRadar } from "@/components/performance/team-comparison-radar"
import { GlassCard } from "@/components/ui/glass-card"
import { SwipePanels } from "@/components/ui/swipe-panels"
import { getSamplePerformanceDashboard } from "@/lib/analysis/performance-dashboard"

export default async function PerformanceDashboardPage() {
  const data = getSamplePerformanceDashboard()

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Analytics</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Performance insights</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Track season momentum, matchup results, and position efficiency. Charts update after each scoring period and integrate imported data across platforms.
        </p>
      </section>
      <SwipePanels aria-label="Season performance summaries" className="md:grid-cols-2">
        <GlassCard tone="default" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Season trends</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Projected vs actual points across the schedule.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <SeasonTrendChart data={data.seasonTrends} />
          </GlassCard.Content>
        </GlassCard>
        <GlassCard tone="default" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Points distribution</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Frequency of total points grouped by range.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <PointsDistributionChart data={data.pointsDistribution} />
          </GlassCard.Content>
        </GlassCard>
      </SwipePanels>
      <SwipePanels
        aria-label="Matchup history and positional efficiency"
        className="md:grid-cols-2 xl:[grid-template-columns:1.1fr_0.9fr]"
      >
        <GlassCard tone="muted" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Matchup history</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Points for and against across recent matchups.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <MatchupHistoryChart data={data.matchupHistory} />
          </GlassCard.Content>
        </GlassCard>
        <GlassCard tone="muted" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Position performance</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Projected vs actual production by lineup spot.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <PositionPerformanceChart data={data.positionPerformance} />
          </GlassCard.Content>
        </GlassCard>
      </SwipePanels>
      <GlassCard tone="brand" className="space-y-4">
        <GlassCard.Header className="space-y-1">
          <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Team comparison radar</GlassCard.Title>
          <p className="text-sm text-slate-600 dark:text-slate-300">Compare efficiency, ceiling, and matchup leverage heading into this week.</p>
        </GlassCard.Header>
        <GlassCard.Content>
          <TeamComparisonRadar data={data.teamRadar} />
        </GlassCard.Content>
      </GlassCard>
    </div>
  )
}
