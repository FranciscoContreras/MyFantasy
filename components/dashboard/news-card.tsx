import { GlassCard } from "@/components/ui/glass-card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewsItem {
  id: string
  title: string
  time: string
  impact: "positive" | "negative" | "neutral"
  summary: string
}

const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "Justin Jefferson logs full practice",
    time: "2h ago",
    impact: "positive",
    summary: "Expected to be removed from the injury report ahead of matchup with DET.",
  },
  {
    id: "2",
    title: "49ers plan expanded touches for Elijah Mitchell",
    time: "4h ago",
    impact: "neutral",
    summary: "Kyle Shanahan notes a 20% increase in RB2 snaps to manage workloads.",
  },
  {
    id: "3",
    title: "Seahawks downgrade DK Metcalf to questionable",
    time: "6h ago",
    impact: "negative",
    summary: "Late-week hip tightness places him in pregame warmup checks.",
  },
]

export function NewsCard({ items = sampleNews }: { items?: NewsItem[] }) {
  return (
    <GlassCard tone="muted" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">News radar</p>
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">
          Beat reports & injury flags
        </GlassCard.Title>
      </GlassCard.Header>
      <GlassCard.Content className="-mx-2">
        <ScrollArea className="max-h-[260px] px-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="rounded-[16px] border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{item.time}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  {item.impact === "positive" && "UPGRADE"}
                  {item.impact === "negative" && "DOWNGRADE"}
                  {item.impact === "neutral" && "NOTE"}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </GlassCard.Content>
    </GlassCard>
  )
}
