"use client"

import { PlayerBattleCard } from "@/components/matchup/player-battle-card"
import { PlayerHighlight } from "@/components/matchup/player-highlight"
import { ProbabilityGauge } from "@/components/matchup/probability-gauge"
import { ProjectionChart } from "@/components/matchup/projection-chart"
import { GlassCard } from "@/components/ui/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type MatchupPhase = "offense" | "defense" | "neutral"

interface MatchupComparisonProps {
  offenseHighlights: Array<{
    name: string
    team: string
    position: string
    projection: number
    matchup: string
    snippet: string
  }>
  defenseHighlights: Array<{
    name: string
    team: string
    position: string
    projection: number
    matchup: string
    snippet: string
  }>
  battles: Array<{
    player: string
    opponent: string
    advantageLabel: string
    advantageValue: number
    matchupNote: string
    projection: {
      player: number
      opponent: number
    }
    phase: MatchupPhase
  }>
  winProbability: number
  chartData: Array<{ label: string; team: number; opponent: number }>
  className?: string
}

function getAverageAdvantage(battles: MatchupComparisonProps["battles"]) {
  if (battles.length === 0) return null
  const total = battles.reduce((sum, battle) => sum + battle.advantageValue, 0)
  return total / battles.length
}

export function MatchupComparison({
  offenseHighlights,
  defenseHighlights,
  battles,
  winProbability,
  chartData,
  className,
}: MatchupComparisonProps) {
  const offenseBattles = battles.filter((battle) => battle.phase === "offense")
  const defenseBattles = battles.filter((battle) => battle.phase === "defense")
  const neutralBattles = battles.filter((battle) => battle.phase === "neutral")

  const offenseAverage = getAverageAdvantage(offenseBattles)
  const defenseAverage = getAverageAdvantage(defenseBattles)

  return (
    <Tabs defaultValue="offense" className={cn("space-y-6", className)}>
      <TabsList className="bg-white/75 shadow-sm dark:bg-slate-900/60">
        <TabsTrigger value="offense">Offense</TabsTrigger>
        <TabsTrigger value="defense">Defense</TabsTrigger>
        <TabsTrigger value="probability">Probability</TabsTrigger>
      </TabsList>
      <TabsContent value="offense" className="space-y-6">
        <GlassCard tone="default" className="space-y-5">
          <GlassCard.Header>
            <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">
              Offensive focus
            </GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Highlighted players with favorable coverage trends and usage signals.
            </p>
          </GlassCard.Header>
          <GlassCard.Content className="flex flex-wrap gap-3">
            {offenseHighlights.map((highlight) => (
              <PlayerHighlight key={highlight.name} {...highlight} />
            ))}
          </GlassCard.Content>
          {offenseAverage !== null && (
            <GlassCard.Footer>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Aggregate leverage • {Math.round(offenseAverage)}% advantage window
              </p>
            </GlassCard.Footer>
          )}
        </GlassCard>
        <div className="grid gap-4 lg:grid-cols-2">
          {offenseBattles.length > 0 ? (
            offenseBattles.map((battle) => {
              const { phase, ...cardProps } = battle
              void phase
              return (
                <PlayerBattleCard
                  key={`${cardProps.player}-${cardProps.opponent}`}
                  {...cardProps}
                />
              )
            })
          ) : (
            <GlassCard tone="muted" className="lg:col-span-2">
              <GlassCard.Content className="text-sm text-slate-600 dark:text-slate-300">
                Offensive battle data will populate once projections finalize for this matchup.
              </GlassCard.Content>
            </GlassCard>
          )}
        </div>
      </TabsContent>
      <TabsContent value="defense" className="space-y-6">
        <GlassCard tone="muted" className="space-y-5">
          <GlassCard.Header>
            <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">
              Defensive spotlight
            </GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Track defenders influencing play calling and red-zone leverage.
            </p>
          </GlassCard.Header>
          <GlassCard.Content className="flex flex-wrap gap-3">
            {defenseHighlights.map((highlight) => (
              <PlayerHighlight key={highlight.name} {...highlight} />
            ))}
          </GlassCard.Content>
          {defenseAverage !== null && (
            <GlassCard.Footer>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Coverage pressure • {Math.round(defenseAverage)}% situational swing
              </p>
            </GlassCard.Footer>
          )}
        </GlassCard>
        <div className="grid gap-4 lg:grid-cols-2">
          {defenseBattles.length > 0 ? (
            defenseBattles.map((battle) => {
              const { phase, ...cardProps } = battle
              void phase
              return (
                <PlayerBattleCard
                  key={`${cardProps.player}-${cardProps.opponent}`}
                  {...cardProps}
                />
              )
            })
          ) : (
            <GlassCard tone="muted" className="lg:col-span-2">
              <GlassCard.Content className="text-sm text-slate-600 dark:text-slate-300">
                Defensive battle data syncs from the latest slate once charting completes.
              </GlassCard.Content>
            </GlassCard>
          )}
        </div>
      </TabsContent>
      <TabsContent value="probability" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_1.2fr]">
          <GlassCard tone="brand" className="flex flex-col items-center gap-6">
            <ProbabilityGauge value={winProbability} label="Win odds" />
            <GlassCard.Footer className="justify-center">
              <p className="text-center text-xs uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">
                Range calibrated from blended projection set and live news weights
              </p>
            </GlassCard.Footer>
          </GlassCard>
          <ProjectionChart data={chartData} />
        </div>
        {neutralBattles.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {neutralBattles.map((battle) => {
              const { phase, ...cardProps } = battle
              void phase
              return (
                <PlayerBattleCard
                  key={`${cardProps.player}-${cardProps.opponent}`}
                  {...cardProps}
                />
              )
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
