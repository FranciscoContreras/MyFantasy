"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/ui/glass-card"
import { PlayerHighlight } from "@/components/matchup/player-highlight"
import { PlayerBattleCard } from "@/components/matchup/player-battle-card"
import { ProbabilityGauge } from "@/components/matchup/probability-gauge"
import { ProjectionChart } from "@/components/matchup/projection-chart"

interface MatchupComparisonProps {
  offenseHighlights: Array<{ name: string; team: string; position: string; projection: number; matchup: string; snippet: string }>
  defenseHighlights: Array<{ name: string; team: string; position: string; projection: number; matchup: string; snippet: string }>
  battles: Array<{ player: string; opponent: string; advantageLabel: string; advantageValue: number; matchupNote: string; projection: { player: number; opponent: number } }>
  winProbability: number
  chartData: Array<{ label: string; team: number; opponent: number }>
}

export function MatchupComparison({ offenseHighlights, defenseHighlights, battles, winProbability, chartData }: MatchupComparisonProps) {
  return (
    <Tabs defaultValue="offense" className="space-y-6">
      <TabsList className="bg-white/75 shadow-sm dark:bg-slate-900/60">
        <TabsTrigger value="offense">Offense</TabsTrigger>
        <TabsTrigger value="defense">Defense</TabsTrigger>
        <TabsTrigger value="probability">Probability</TabsTrigger>
      </TabsList>
      <TabsContent value="offense" className="space-y-6">
        <GlassCard tone="default" className="space-y-4">
          <GlassCard.Header>
            <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">Offensive focus</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Highlighted players with favorable coverage trends and usage signals.
            </p>
          </GlassCard.Header>
          <GlassCard.Content className="flex flex-wrap gap-3">
            {offenseHighlights.map((highlight) => (
              <PlayerHighlight key={highlight.name} {...highlight} />
            ))}
          </GlassCard.Content>
        </GlassCard>
        <div className="grid gap-4 lg:grid-cols-2">
          {battles.slice(0, 2).map((battle) => (
            <PlayerBattleCard key={battle.player} {...battle} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="defense" className="space-y-6">
        <GlassCard tone="muted" className="space-y-4">
          <GlassCard.Header>
            <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">Defensive spotlight</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Track which defenders influence play calling and red-zone leverage.
            </p>
          </GlassCard.Header>
          <GlassCard.Content className="flex flex-wrap gap-3">
            {defenseHighlights.map((highlight) => (
              <PlayerHighlight key={highlight.name} {...highlight} />
            ))}
          </GlassCard.Content>
        </GlassCard>
        <div className="grid gap-4 lg:grid-cols-2">
          {battles.slice(2, 4).map((battle) => (
            <PlayerBattleCard key={battle.player} {...battle} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="probability" className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <GlassCard tone="brand" className="flex items-center justify-center">
          <ProbabilityGauge value={winProbability} label="Win odds" />
        </GlassCard>
        <ProjectionChart data={chartData} />
      </TabsContent>
    </Tabs>
  )
}
