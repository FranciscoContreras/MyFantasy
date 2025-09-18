import type { ComponentType } from "react"

import { formatDistanceToNowStrict } from "date-fns"
import { Activity, ClipboardList, HeartPulse, Newspaper, Shuffle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import type { NotificationPayload } from "@/lib/notifications/types"
import { cn } from "@/lib/utils"

interface NotificationCardProps {
  notification: NotificationPayload
}

const categoryConfig: Record<NotificationPayload["category"], { label: string; tone: string; icon: ComponentType<{ className?: string }> }> = {
  injury: { label: "Injury", tone: "text-rose-500", icon: HeartPulse },
  trade: { label: "Trade", tone: "text-indigo-500", icon: Shuffle },
  lineup: { label: "Lineup", tone: "text-amber-500", icon: ClipboardList },
  score: { label: "Score", tone: "text-emerald-500", icon: Activity },
  news: { label: "News", tone: "text-slate-500", icon: Newspaper },
}

const severityTone: Record<NotificationPayload["severity"], string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-200",
  medium: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
  high: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const config = categoryConfig[notification.category]
  const Icon = config.icon
  const timeAgo = formatDistanceToNowStrict(new Date(notification.timestamp), { addSuffix: true })

  return (
    <GlassCard tone="default" className={cn("space-y-4", notification.read && "opacity-60")}
    >
      <GlassCard.Header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/60 shadow-sm dark:bg-slate-900/60", config.tone)}>
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">
                {notification.title}
              </GlassCard.Title>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                {config.label}
              </p>
            </div>
          </div>
          <Badge className={severityTone[notification.severity]}>{notification.severity.toUpperCase()}</Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
      </GlassCard.Header>
      <GlassCard.Content className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{timeAgo}</span>
          {notification.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-slate-300 bg-white/70 text-slate-600 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300">
              #{tag}
            </Badge>
          ))}
        </div>
        {notification.actions.length ? (
          <div className="flex flex-wrap gap-2">
            {notification.actions.map((action) => {
              if (action.href) {
                return (
                  <Button key={action.label} variant="outline" size="sm" asChild>
                    <a href={action.href}>{action.label}</a>
                  </Button>
                )
              }
              return (
                <Button key={action.label} variant="ghost" size="sm">
                  {action.label}
                </Button>
              )
            })}
          </div>
        ) : null}
        {notification.entities?.length ? (
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            {notification.entities.map((entity) => (
              <Badge
                key={`${notification.id}-${entity.id}`}
                variant="outline"
                className="border-transparent bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-200"
              >
                {entity.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </GlassCard.Content>
    </GlassCard>
  )
}
