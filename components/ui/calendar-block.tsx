import { GlassCard } from "@/components/ui/glass-card"

interface CalendarBlockProps {
  embedUrl?: string
}

export function CalendarBlock({ embedUrl = "https://cal.com/" }: CalendarBlockProps) {
  return (
    <GlassCard className="border-white/40 bg-white/85 p-0 dark:border-white/10 dark:bg-slate-900/60">
      <div className="flex flex-col gap-6 p-6 sm:p-10">
        <div className="space-y-2 text-left">
          <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">Book a 20-minute strategy call</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Walk through the optimizer, imports, and glass dashboards with our product team.
          </p>
        </div>
        <div className="w-full overflow-hidden rounded-[20px] border border-white/40 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:border-white/10 dark:bg-slate-900/60">
          <iframe
            src={embedUrl}
            title="Schedule meeting"
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </GlassCard>
  )
}
