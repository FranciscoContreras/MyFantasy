import { cn } from "@/lib/utils"

interface StatItem {
  label: string
  value: string
  caption?: string
}

interface StatsStripProps {
  items: StatItem[]
  className?: string
}

export function StatsStrip({ items, className }: StatsStripProps) {
  return (
    <div
      className={cn(
        "grid gap-4 rounded-[20px] border border-white/40 bg-white/80 p-6 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60 sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {item.label}
          </span>
          <span className="text-xl font-semibold leading-snug text-slate-900 sm:text-3xl dark:text-white">
            {item.value}
          </span>
          {item.caption ? (
            <span className="text-sm text-slate-600 dark:text-slate-300">{item.caption}</span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
