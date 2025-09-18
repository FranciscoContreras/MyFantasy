import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { StartSitRecommendation } from "@/lib/recommendations/types"

interface StartSitPanelProps {
  recommendations: StartSitRecommendation[]
}

export function StartSitPanel({ recommendations }: StartSitPanelProps) {
  const startRecs = recommendations.filter((rec) => rec.type === "start")
  const sitRecs = recommendations.filter((rec) => rec.type === "sit")

  return (
    <Tabs defaultValue="start" className="space-y-6">
      <TabsList className="bg-white/75 shadow-sm dark:bg-slate-900/60">
        <TabsTrigger value="start">Start recommendations</TabsTrigger>
        <TabsTrigger value="sit">Sit recommendations</TabsTrigger>
      </TabsList>
      <TabsContent value="start" className="space-y-4">
        {startRecs.length ? startRecs.map(renderCard) : <EmptyState message="No start upgrades detected." />}
      </TabsContent>
      <TabsContent value="sit" className="space-y-4">
        {sitRecs.length ? sitRecs.map(renderCard) : <EmptyState message="No sit downgrades detected." />}
      </TabsContent>
    </Tabs>
  )
}

function renderCard(rec: StartSitRecommendation) {
  return (
    <GlassCard key={rec.id} tone={rec.type === "start" ? "brand" : "muted"} className="space-y-4">
      <GlassCard.Header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">
            {rec.type === "start" ? "Start" : "Sit"} {rec.player.name}
          </GlassCard.Title>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {rec.player.team} • {rec.player.position} • vs {rec.player.opponent}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="border-transparent bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
            {rec.confidence}% confidence
          </Badge>
          <Badge className="border-transparent bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
            +{rec.delta.toFixed(1)} pts delta
          </Badge>
        </div>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-4">
        <div className="grid gap-3 rounded-[16px] border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Projection</span>
            <span className="text-base font-semibold text-slate-900 dark:text-white">{rec.projectedPoints.toFixed(1)} pts</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Baseline {rec.baseline.toFixed(1)} pts</span>
            <span>Gain {rec.delta.toFixed(1)} pts</span>
          </div>
          <Progress value={Math.min(rec.projectedPoints, 180)} className="h-2" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{rec.reasoning}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {rec.alternatives.map((alt) => (
            <div
              key={alt.id}
              className="rounded-[16px] border border-white/60 bg-white/80 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white">{alt.name}</span>
                <Badge className="border-transparent bg-white/90 text-slate-600 dark:bg-slate-900/70 dark:text-slate-200">
                  {alt.projectedPoints.toFixed(1)} pts
                </Badge>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">{alt.position} • {alt.team}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Delta vs current {alt.delta.toFixed(1)} pts</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300">
          <span>
            Historical accuracy: {rec.history.successRate}% ({rec.history.sampleSize} samples)
          </span>
          {rec.history.lastFive.length ? (
            <div className="inline-flex items-center gap-1">
              Last games:
              {rec.history.lastFive.map((entry) => (
                <span
                  key={entry.week}
                  className={
                    entry.success
                      ? "inline-flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400"
                      : "inline-flex h-3 w-3 items-center justify-center rounded-full bg-rose-400"
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
      </GlassCard.Content>
    </GlassCard>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <GlassCard tone="muted" className="p-8 text-center text-sm text-slate-500 dark:text-slate-300">
      {message}
    </GlassCard>
  )
}
