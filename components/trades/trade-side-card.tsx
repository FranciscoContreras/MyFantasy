import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import type { TradeValueBreakdown, TradeImpactSummary, TradePackage, TradePlayerValuation } from "@/lib/trades/types"

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
  const riskDelta = value.incoming.riskAdjustment - value.outgoing.riskAdjustment
  const scheduleDelta = value.incoming.scheduleAdjustment - value.outgoing.scheduleAdjustment
  const weeklySwing = value.incoming.perGame - value.outgoing.perGame
  const ceilingDelta = value.incoming.ceiling - value.outgoing.ceiling

  return (
    <GlassCard tone="default" className="space-y-5">
      <GlassCard.Header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
        <GlassCard.Title className="text-xl font-semibold text-slate-900 dark:text-white">{packageInfo.teamName}</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Manager {packageInfo.manager ?? "—"}</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-4">
        <section className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          <MetricRow
            label="Outgoing value"
            badgeTone="negative"
            value={`${value.outgoing.total.toFixed(1)} pts ROS`}
          />
          <MetricRow
            label="Incoming value"
            badgeTone="positive"
            value={`${value.incoming.total.toFixed(1)} pts ROS`}
          />
          <MetricRow
            label="Net delta"
            badgeTone="neutral"
            value={`${value.net >= 0 ? "+" : ""}${value.net.toFixed(1)} pts`}
          />
          <MetricRow
            label="Weekly swing"
            badgeTone={weeklySwing >= 0 ? "positive" : "negative"}
            value={`${weeklySwing >= 0 ? "+" : ""}${weeklySwing.toFixed(2)} pts`}
          />
          <MetricRow
            label="Risk shift"
            badgeTone={riskDelta >= 0 ? "positive" : "negative"}
            value={`${riskDelta >= 0 ? "+" : ""}${(riskDelta * 100).toFixed(0)}% stability`}
          />
          <MetricRow
            label="Schedule shift"
            badgeTone={scheduleDelta >= 0 ? "positive" : "negative"}
            value={`${scheduleDelta >= 0 ? "+" : ""}${(scheduleDelta * 100).toFixed(0)}% ease`}
          />
          <MetricRow
            label="Ceiling delta"
            badgeTone={ceilingDelta >= 0 ? "positive" : "negative"}
            value={`${ceilingDelta >= 0 ? "+" : ""}${ceilingDelta.toFixed(1)} pts`}
          />
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
        <section className="grid gap-4 lg:grid-cols-2">
          <PlayerValueList title="Outgoing package" tone="outgoing" players={value.outgoing.players} />
          <PlayerValueList title="Incoming package" tone="incoming" players={value.incoming.players} />
        </section>
      </GlassCard.Content>
    </GlassCard>
  )
}

function MetricRow({
  label,
  value,
  badgeTone,
}: {
  label: string
  value: string
  badgeTone: "positive" | "negative" | "neutral"
}) {
  const toneClass =
    badgeTone === "positive"
      ? "border-transparent bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"
      : badgeTone === "negative"
        ? "border-transparent bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200"
        : "border-transparent bg-white/85 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200"

  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <Badge className={toneClass}>{value}</Badge>
    </div>
  )
}

function PlayerValueList({
  title,
  players,
  tone,
}: {
  title: string
  players: TradePlayerValuation[]
  tone: "incoming" | "outgoing"
}) {
  const borderTone =
    tone === "incoming"
      ? "border-emerald-200/60 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/10"
      : "border-rose-200/60 bg-rose-50/70 dark:border-rose-500/20 dark:bg-rose-500/10"

  return (
    <div className={`grid gap-3 rounded-[16px] border p-4 shadow-inner ${borderTone}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        <span>{title}</span>
        <span>{players.length} player{players.length === 1 ? "" : "s"}</span>
      </div>
      <div className="grid gap-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="rounded-[12px] border border-white/60 bg-white/90 p-3 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900 dark:text-white">{player.name}</span>
              <Badge className="border-transparent bg-white/85 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                {player.adjustedPerGame.toFixed(1)} /g
              </Badge>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
              {player.position} • {player.team}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>ROS avg {player.restOfSeasonProjection.toFixed(1)}</span>
              <span>Total {player.restOfSeasonTotal.toFixed(1)}</span>
              <span>Floor {player.floor.toFixed(1)}</span>
              <span>Ceiling {player.ceiling.toFixed(1)}</span>
              <span>Risk {Math.round(player.riskScore * 100)}%</span>
              <span>Schedule {Math.round(player.scheduleScore * 100)}%</span>
            </div>
            {player.byeWeeksRemaining ? (
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Bye weeks remaining: {player.byeWeeksRemaining}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
