import { NotificationFeed } from "@/components/notifications/notification-feed"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { getSampleNotificationFeed } from "@/lib/notifications/sample-data"
import type { NotificationCategory } from "@/lib/notifications/types"

const categoryLabels: Record<NotificationCategory, string> = {
  injury: "Injury",
  trade: "Trade",
  lineup: "Lineup",
  score: "Score",
  news: "News",
}

export default async function NotificationsPage() {
  const feed = getSampleNotificationFeed()
  const unreadCount = feed.notifications.filter((item) => !item.read).length
  const highSeverity = feed.notifications.filter((item) => item.severity === "high").length

  const categoryBreakdown = feed.notifications.reduce<Record<NotificationCategory, number>>((acc, notification) => {
    acc[notification.category] = (acc[notification.category] ?? 0) + 1
    return acc
  }, { injury: 0, trade: 0, lineup: 0, score: 0, news: 0 })

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Notifications</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Smart alerts & updates</h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Injury designations, trade proposals, lineup locks, live scoring swings, and curated news updates surface here in real time. Use filters to focus on what matters before kickoff.
        </p>
      </section>
      <GlassCard tone="muted" className="grid gap-4 lg:grid-cols-4">
        <SummaryTile label="Total alerts" value={feed.notifications.length.toString()} detail={`Week ${feed.week} • Season ${feed.season}`} />
        <SummaryTile label="Unread" value={unreadCount.toString()} detail="Catch up before lineup lock" badgeTone="accent" />
        <SummaryTile label="High severity" value={highSeverity.toString()} detail="Monitor injury designations" badgeTone="negative" />
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Category split</p>
          <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {(Object.keys(categoryLabels) as NotificationCategory[]).map((category) => (
              <div key={category} className="flex items-center justify-between rounded-[14px] border border-white/50 bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
                <span>{categoryLabels[category]}</span>
                <Badge variant="outline" className="border-slate-200 bg-white/60 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                  {categoryBreakdown[category] ?? 0}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
      <NotificationFeed notifications={feed.notifications} />
    </div>
  )
}

function SummaryTile({
  label,
  value,
  detail,
  badgeTone = "neutral",
}: {
  label: string
  value: string
  detail: string
  badgeTone?: "neutral" | "accent" | "negative"
}) {
  const badgeClass = {
    neutral: "border-transparent bg-white/85 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
    accent: "border-transparent bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
    negative: "border-transparent bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
  }[badgeTone]

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</span>
        <Badge className={badgeClass}>{label}</Badge>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </div>
  )
}
