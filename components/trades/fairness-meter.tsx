import { cn } from "@/lib/utils"

interface FairnessMeterProps {
  score: number
  verdict: "fair" | "tilted-team-a" | "tilted-team-b"
}

const verdictCopy: Record<FairnessMeterProps["verdict"], string> = {
  fair: "Fair for both sides",
  "tilted-team-a": "Advantage Team A",
  "tilted-team-b": "Advantage Team B",
}

export function FairnessMeter({ score, verdict }: FairnessMeterProps) {
  const clamped = Math.min(Math.max(score, 0), 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        <span>Fairness</span>
        <span>{clamped}%</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/40 dark:bg-slate-900/60">
        <div
          className={cn(
            "absolute inset-y-0 rounded-full shadow-[0_8px_25px_rgba(15,23,42,0.25)] transition-all",
            verdict === "fair" && "bg-emerald-400",
            verdict === "tilted-team-a" && "bg-indigo-400",
            verdict === "tilted-team-b" && "bg-rose-400",
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{verdictCopy[verdict]}</p>
    </div>
  )
}
