import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/glass-card"

interface StatsCardProps {
  label: string
  value: string
  trend?: "up" | "down"
  trendValue?: string
  sublabel?: string
  className?: string
}

export function StatsCard({ label, value, trend, trendValue, sublabel, className }: StatsCardProps) {
  return (
    <GlassCard tone="default" size="compact" className={cn("space-y-3", className)}>
      <GlassCard.Header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
        <GlassCard.Title className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</GlassCard.Title>
      </GlassCard.Header>
      {sublabel ? <p className="text-xs text-slate-500 dark:text-slate-300">{sublabel}</p> : null}
      {trend && trendValue ? (
        <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-200">
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-rose-500" />
          )}
          <span className={trend === "up" ? "text-emerald-600" : "text-rose-500"}>{trendValue}</span>
          <span className="text-slate-500 dark:text-slate-300">vs last week</span>
        </div>
      ) : null}
    </GlassCard>
  )
}
