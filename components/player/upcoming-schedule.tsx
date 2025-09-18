import { GlassCard } from "@/components/ui/glass-card"
import type { PlayerUpcomingGame } from "@/lib/analysis/player-dashboard"

interface UpcomingScheduleProps {
  games: PlayerUpcomingGame[]
}

export function UpcomingSchedule({ games }: UpcomingScheduleProps) {
  return (
    <GlassCard tone="muted" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming schedule</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Matchup ratings and projections for the next three weeks.</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-3">
        {games.map((game) => (
          <div
            key={game.week}
            className="flex items-center justify-between rounded-[16px] border border-white/60 bg-white/85 px-3 py-2 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
          >
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{game.week}</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                {game.venue === "home" ? "Home" : "Away"} vs {game.opponent}
              </p>
              {game.notes ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{game.notes}</p> : null}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">Matchup rating</p>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">{game.matchupRating}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Proj {game.projectedPoints.toFixed(1)} pts</p>
            </div>
          </div>
        ))}
      </GlassCard.Content>
    </GlassCard>
  )
}
