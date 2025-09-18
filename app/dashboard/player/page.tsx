import Image from "next/image"
import dynamic from "next/dynamic"

import { SeasonStatsGrid } from "@/components/player/season-stats-grid"
import { GlassCard } from "@/components/ui/glass-card"
import { ChartSkeleton } from "@/components/ui/chart-skeleton"
import { getSamplePlayerDashboard } from "@/lib/analysis/player-dashboard"
import { SwipePanels } from "@/components/ui/swipe-panels"

const GameLogTable = dynamic(
  () => import("@/components/player/game-log-table").then((mod) => mod.GameLogTable),
  { ssr: false, loading: () => <ChartSkeleton label="Loading game log" className="h-[260px]" /> },
)

const SplitsChart = dynamic(
  () => import("@/components/player/splits-chart").then((mod) => mod.SplitsChart),
  { ssr: false, loading: () => <ChartSkeleton label="Loading splits" className="h-[240px]" /> },
)

const UpcomingSchedule = dynamic(
  () => import("@/components/player/upcoming-schedule").then((mod) => mod.UpcomingSchedule),
  { ssr: false, loading: () => <ChartSkeleton label="Building schedule" className="h-[220px]" /> },
)

const PlayerNewsFeed = dynamic(
  () => import("@/components/player/news-feed").then((mod) => mod.PlayerNewsFeed),
  { ssr: false, loading: () => <ChartSkeleton label="Fetching news" className="h-[220px]" /> },
)

export default async function PlayerDashboardPage() {
  const data = getSamplePlayerDashboard()

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {data.player.avatarUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/60 shadow-lg dark:border-white/10">
              <Image
                src={data.player.avatarUrl}
                alt={data.player.name}
                fill
                sizes="(max-width: 768px) 64px, 96px"
                className="object-cover"
                priority={false}
              />
            </div>
          ) : null}
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Player focus</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{data.player.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {data.player.team} • {data.player.position}
            </p>
          </div>
        </div>
        <GlassCard tone="muted" className="px-4 py-3">
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Performance delta</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white">+18%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">above league average</span>
          </div>
        </GlassCard>
      </header>
      <SeasonStatsGrid stats={data.seasonStats} />
      <SwipePanels
        aria-label="Player game log and splits"
        className="md:grid-cols-1 xl:[grid-template-columns:1.05fr_0.95fr]"
      >
        <GameLogTable data={data.gameLog} />
        <GlassCard tone="muted" className="space-y-4">
          <GlassCard.Header className="space-y-1">
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Splits analysis</GlassCard.Title>
            <p className="text-sm text-slate-600 dark:text-slate-300">Contextualizing production in different scenarios.</p>
          </GlassCard.Header>
          <GlassCard.Content>
            <SplitsChart data={data.splits} />
          </GlassCard.Content>
        </GlassCard>
      </SwipePanels>
      <SwipePanels aria-label="Upcoming schedule and news" className="md:grid-cols-1 lg:grid-cols-2">
        <UpcomingSchedule games={data.upcoming} />
        <PlayerNewsFeed items={data.news} />
      </SwipePanels>
    </div>
  )
}
