import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import type { TradeValueBreakdown, TradeImpactSummary, TradePackage } from "@/lib/trades/types"

interface TradeSideCardProps {
  label: string
  packageInfo: TradePackage
  value: {
    outgoing: TradeValueBreakdown
    incoming: TradeValueBreakdown
    net: number
    impact: TradeImpactSummary
  }
}

export function TradeSideCard({ label, packageInfo, value }: TradeSideCardProps) {
  return (
    <GlassCard tone="default" className="space-y-5">
      <GlassCard.Header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
        <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">{packageInfo.teamName}</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Manager {packageInfo.manager ?? "—"}</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-4">
        <section className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span>Outgoing value</span>
            <Badge className="border-transparent bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
              {value.outgoing.total.toFixed(1)} pts
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Incoming value</span>
            <Badge className="border-transparent bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
              {value.incoming.total.toFixed(1)} pts
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Net delta</span>
            <Badge className="border-transparent bg-white/85 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              {value.net >= 0 ? "+" : ""}
              {value.net.toFixed(1)} pts
            </Badge>
          </div>
        </section>
        <section className="grid gap-3 rounded-[16px] border border-white/60 bg-white/85 p-4 text-xs text-slate-500 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white">Impact</p>
          <div className="flex items-center justify-between">
            <span>Weekly points</span>
            <span>{value.impact.weeklyPointDelta >= 0 ? "+" : ""}{value.impact.weeklyPointDelta.toFixed(2)} pts</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Projected wins</span>
            <span>{value.impact.projectedRecordDelta >= 0 ? "+" : ""}{value.impact.projectedRecordDelta.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Playoff odds</span>
            <span>{value.impact.playoffProbabilityDelta >= 0 ? "+" : ""}{(value.impact.playoffProbabilityDelta * 100).toFixed(1)}%</span>
          </div>
          {value.impact.rosterBalanceNotes.map((note) => (
            <p key={note}>• {note}</p>
          ))}
        </section>
      </GlassCard.Content>
    </GlassCard>
  )
}
