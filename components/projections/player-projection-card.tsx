import type { ReactNode } from "react"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProjectionPlayerSummary } from "@/lib/analysis/projections-dashboard"
import { WeeklyProjectionChart } from "@/components/projections/weekly-projection-chart"
import { ProbabilityDistributionChart } from "@/components/projections/probability-distribution-chart"
import { BoomBustMeter } from "@/components/projections/boom-bust-meter"
import { TargetShareTable } from "@/components/projections/target-share-table"

interface PlayerProjectionCardProps {
  player: ProjectionPlayerSummary
  className?: string
}

export function PlayerProjectionCard({ player, className }: PlayerProjectionCardProps) {
  return (
    <GlassCard tone="default" className={cn("space-y-5", className)}>
      <GlassCard.Header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">
            {player.name}
          </GlassCard.Title>
          <Badge className="border-transparent bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
            {player.position}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {player.team} • {player.matchup}
        </p>
      </GlassCard.Header>
      <GlassCard.Content className="grid gap-5">
        <section className="grid gap-3 rounded-[16px] border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBlock label="Mean" value={`${player.mean.toFixed(1)} pts`} accent="text-indigo-600" />
            <StatBlock label="Floor" value={`${player.floor.toFixed(1)} pts`} accent="text-slate-500" />
            <StatBlock label="Ceiling" value={`${player.ceiling.toFixed(1)} pts`} accent="text-emerald-600" />
            <StatBlock label="Volatility" value={`${Math.round(player.volatility * 100)}%`} accent="text-amber-600" />
          </div>
        </section>
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <SectionTitle>Weekly projection</SectionTitle>
            <WeeklyProjectionChart data={player.weekly} />
          </div>
          <div className="space-y-3">
            <SectionTitle>Probability distribution</SectionTitle>
            <ProbabilityDistributionChart data={player.distribution} />
          </div>
        </section>
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <SectionTitle>Boom / Bust profile</SectionTitle>
            <BoomBustMeter boom={player.boomProbability} bust={player.bustProbability} />
          </div>
          <div className="space-y-3">
            <SectionTitle>Target share outlook</SectionTitle>
            <TargetShareTable data={player.targetShare} />
          </div>
        </section>
      </GlassCard.Content>
    </GlassCard>
  )
}

function StatBlock({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn("mt-1 text-base font-semibold text-slate-900 dark:text-white", accent)}>{value}</p>
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{children}</p>
}
