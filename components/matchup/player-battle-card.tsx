import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

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
  className?: string
}

export function PlayerBattleCard({
  player,
  opponent,
  advantageLabel,
  advantageValue,
  matchupNote,
  projection,
  className,
}: PlayerBattleProps) {
  const playerPct = Math.min(Math.max(advantageValue, 0), 100)
  const opponentPct = Math.min(Math.max(100 - playerPct, 0), 100)
  const projectionDelta = projection.player - projection.opponent

  return (
    <GlassCard tone="default" className={cn("space-y-5", className)}>
      <GlassCard.Header className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">
            {player} vs {opponent}
          </GlassCard.Title>
          <Badge className="border-transparent bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
            {advantageLabel}
          </Badge>
        </div>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Matchup edge</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-5">
        <div className="grid gap-3">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
              <span>You</span>
              <span>{playerPct.toFixed(0)}%</span>
            </div>
            <Progress value={playerPct} className="mt-1 h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
              <span>Opponent</span>
              <span>{opponentPct.toFixed(0)}%</span>
            </div>
            <Progress value={opponentPct} className="mt-1 h-2 bg-amber-100/60 dark:bg-amber-500/25" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-[16px] border border-white/60 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Projection</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{projection.player.toFixed(1)} pts</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Opponent</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{projection.opponent.toFixed(1)} pts</p>
            <Badge
              className={cn(
                "mt-2 border-transparent px-2 py-0.5 text-xs font-semibold",
                projectionDelta >= 0
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
              )}
            >
              {projectionDelta >= 0 ? `+${projectionDelta.toFixed(1)} edge` : `${projectionDelta.toFixed(1)} edge`}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{matchupNote}</p>
      </GlassCard.Content>
    </GlassCard>
  )
}
