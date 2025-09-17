import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
}

export function FeatureCard({ icon, title, description, badge, className, ...props }: FeatureCardProps) {
  return (
    <GlassCard
      className={cn(
        "group relative overflow-hidden border-white/30 dark:border-white/10 bg-gradient-to-br from-white/70 via-white/40 to-white/10 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-900/10",
        "shadow-[0_25px_70px_-30px_rgba(15,23,42,0.5)]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-sky-100/40 via-blue-100/10 to-transparent dark:from-sky-500/10 dark:via-blue-500/10" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 text-blue-600 shadow-inner shadow-blue-100/60 dark:bg-slate-800/80 dark:text-sky-300 dark:shadow-sky-900/40">
            {icon}
          </div>
          {badge ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
    </GlassCard>
  )
}
