import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface BoomBustMeterProps {
  boom: number
  bust: number
}

export function BoomBustMeter({ boom, bust }: BoomBustMeterProps) {
  const boomPct = Math.round(boom * 100)
  const bustPct = Math.round(bust * 100)

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        <span>Boom chance</span>
        <Badge className="border-transparent bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
          {boomPct}%
        </Badge>
      </div>
      <Progress value={boomPct} className="h-2" />
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        <span>Bust chance</span>
        <Badge className="border-transparent bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
          {bustPct}%
        </Badge>
      </div>
      <Progress value={bustPct} className="h-2 bg-rose-100/60 dark:bg-rose-500/25" />
    </div>
  )
}
