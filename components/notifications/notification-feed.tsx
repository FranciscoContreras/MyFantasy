"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { NotificationCategory, NotificationPayload } from "@/lib/notifications/types"

import { NotificationCard } from "@/components/notifications/notification-card"

const categoryLabels: Record<NotificationCategory, string> = {
  injury: "Injury",
  trade: "Trade",
  lineup: "Lineup",
  score: "Score",
  news: "News",
}

interface NotificationFeedProps {
  notifications: NotificationPayload[]
}

export function NotificationFeed({ notifications }: NotificationFeedProps) {
  const [category, setCategory] = useState<NotificationCategory | "all">("all")
  const [unreadOnly, setUnreadOnly] = useState(false)

  const filtered = useMemo(() => {
    return notifications.filter((item) => {
      if (unreadOnly && item.read) {
        return false
      }
      if (category !== "all" && item.category !== category) {
        return false
      }
      return true
    })
  }, [notifications, category, unreadOnly])

  return (
    <div className="grid gap-4">
      <GlassCard tone="muted" className="space-y-3">
        <GlassCard.Content className="flex flex-wrap items-center gap-2">
          <FilterButton active={category === "all"} label="All" onClick={() => setCategory("all")} />
          {(Object.keys(categoryLabels) as NotificationCategory[]).map((key) => (
            <FilterButton
              key={key}
              active={category === key}
              label={categoryLabels[key]}
              onClick={() => setCategory(key)}
              count={notifications.filter((item) => item.category === key).length}
            />
          ))}
          <Button
            variant={unreadOnly ? "default" : "ghost"}
            size="sm"
            onClick={() => setUnreadOnly((prev) => !prev)}
          >
            {unreadOnly ? "Showing unread" : "All notifications"}
          </Button>
        </GlassCard.Content>
      </GlassCard>
      <ScrollArea className="max-h-[640px] pr-2">
        <div className="grid gap-4">
          {filtered.length ? (
            filtered.map((notification) => <NotificationCard key={notification.id} notification={notification} />)
          ) : (
            <GlassCard tone="muted" className="p-10 text-center text-sm text-slate-500 dark:text-slate-300">
              No notifications match the selected filters.
            </GlassCard>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function FilterButton({
  active,
  label,
  onClick,
  count,
}: {
  active: boolean
  label: string
  onClick: () => void
  count?: number
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <span>{label}</span>
      {typeof count === "number" ? (
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
          {count}
        </span>
      ) : null}
    </Button>
  )
}
