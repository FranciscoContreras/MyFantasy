import { Badge } from "@/components/ui/badge"
import type { ProjectionTargetShare } from "@/lib/analysis/projections-dashboard"

interface TargetShareTableProps {
  data: ProjectionTargetShare[]
}

export function TargetShareTable({ data }: TargetShareTableProps) {
  return (
    <div className="grid gap-2">
      {data.map((row) => {
        const delta = row.delta
        const badgeTone =
          delta >= 0
            ? "border-transparent bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"
            : "border-transparent bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200"

        return (
          <div
            key={row.situation}
            className="flex items-center justify-between rounded-[14px] border border-white/60 bg-white/85 px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300"
          >
            <span>{row.situation}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">{row.percentage.toFixed(1)}%</span>
              <Badge className={badgeTone}>{delta >= 0 ? "+" : ""}{delta.toFixed(1)}%</Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
