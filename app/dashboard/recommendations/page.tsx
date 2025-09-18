import { StartSitRecommendationEngine } from "@/lib/recommendations/start-sit"
import { sampleStartSitRoster } from "@/lib/recommendations/sample-data"
import { StartSitPanel } from "@/components/recommendations/start-sit-panel"
import { GlassCard } from "@/components/ui/glass-card"

export default async function RecommendationsPage() {
  const engine = new StartSitRecommendationEngine({ autoAnalyze: false })
  const recommendations = await engine.generate({
    season: 2024,
    week: 15,
    roster: sampleStartSitRoster,
    maxRecommendations: 6,
  })

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Start / Sit</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Recommendation engine</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          AI suggestions blend projections, matchup context, and historical accuracy. Recommendations refresh automatically when injuries, weather, or imports change.
        </p>
      </section>
      <StartSitPanel recommendations={recommendations.recommendations} />
      <GlassCard tone="muted" className="space-y-3">
        <GlassCard.Header>
          <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">
            How confidence is calculated
          </GlassCard.Title>
        </GlassCard.Header>
        <GlassCard.Content className="text-sm text-slate-600 dark:text-slate-300">
          We combine TensorFlow projections, matchup volatility, and historical form. Confidence uplifts when multiple factors align and drops when volatility or injuries spike. Historical accuracy reflects the last 10 tracked recommendations for each player.
        </GlassCard.Content>
      </GlassCard>
    </div>
  )
}
