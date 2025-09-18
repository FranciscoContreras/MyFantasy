import { Progress } from "@/components/ui/progress"
import { GlassCard } from "@/components/ui/glass-card"

interface PlayerBattleProps {
  player: string
  opponent: string
  advantageLabel: string
  advantageValue: number
  matchupNote: string
  projection: {
    player: number
    opponent: number
  }
}

export function PlayerBattleCard({ player, opponent, advantageLabel, advantageValue, matchupNote, projection }: PlayerBattleProps) {
  const pct = Math.max(Math.min(advantageValue, 100), 0)

  return (
    <GlassCard tone="default" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">{player} vs {opponent}</GlassCard.Title>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{advantageLabel}</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
            <span>You</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-[16px] border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Projection</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{projection.player.toFixed(1)} pts</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Opponent</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{projection.opponent.toFixed(1)} pts</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{matchupNote}</p>
      </GlassCard.Content>
    </GlassCard>
  )
}
