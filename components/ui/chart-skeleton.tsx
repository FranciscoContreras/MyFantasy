import { cn } from "@/lib/utils"

interface ChartSkeletonProps {
  label?: string
  className?: string
}

export function ChartSkeleton({ label = "Loading visualization", className }: ChartSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-200/70 bg-slate-100/40 text-xs font-medium text-slate-400 shadow-inner backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-500",
        "animate-pulse",
        className,
      )}
    >
      {label}
    </div>
  )
}
