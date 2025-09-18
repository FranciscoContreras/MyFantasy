import { GlassCard } from "@/components/ui/glass-card"
import type { PlayerNewsItem } from "@/lib/analysis/player-dashboard"

interface PlayerNewsFeedProps {
  items: PlayerNewsItem[]
}

export function PlayerNewsFeed({ items }: PlayerNewsFeedProps) {
  return (
    <GlassCard tone="default" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Latest news</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Updates aggregated from beat writers and analytics partners.</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="space-y-2 rounded-[16px] border border-white/60 bg-white/85 p-4 shadow-inner dark:border-white/10 dark:bg-slate-900/60">
            <header className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                {item.source} • {new Date(item.timestamp).toLocaleString()}
              </p>
            </header>
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
          </article>
        ))}
      </GlassCard.Content>
    </GlassCard>
  )
}
