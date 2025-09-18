import { GlassCard } from "@/components/ui/glass-card"
import { Progress } from "@/components/ui/progress"

interface MatchupCardProps {
  teamName?: string
  opponentName?: string
  winProbability?: number
  projectedScore?: {
    team: number
    opponent: number
  }
  kickOff?: string
  venue?: string
}

export function MatchupCard({
  teamName = "Bay Area Legends",
  opponentName = "Silicon Valley Sharks",
  winProbability = 62,
  projectedScore = { team: 134.2, opponent: 121.5 },
  kickOff = "Sun 1:25 PM PT",
  venue = "Levi's Stadium",
}: MatchupCardProps) {
  return (
    <GlassCard tone="brand" className="space-y-6">
      <GlassCard.Header className="space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">
          <span>Weekly matchup</span>
          <span>{kickOff}</span>
        </div>
        <GlassCard.Title className="text-2xl font-semibold text-slate-900 dark:text-white">
          {teamName} vs {opponentName}
        </GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Projected showdown at {venue}. Weather monitoring enabled.</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>Win probability</span>
            <span>{winProbability}%</span>
          </div>
          <Progress value={winProbability} className="h-2" />
        </div>
        <div className="grid gap-3 rounded-[16px] border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">Projected score</span>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Ceiling</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>{teamName}</span>
            <span>{projectedScore.team.toFixed(1)} pts</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-300">
            <span>{opponentName}</span>
            <span>{projectedScore.opponent.toFixed(1)} pts</span>
          </div>
        </div>
      </GlassCard.Content>
    </GlassCard>
  )
}
