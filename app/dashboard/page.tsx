import Link from "next/link"

import { StatsCard } from "@/components/dashboard/stats-card"
import { TeamOverviewTable } from "@/components/dashboard/team-overview"
import { MatchupCard } from "@/components/dashboard/matchup-card"
import { NewsCard } from "@/components/dashboard/news-card"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"

const statHighlights = [
  { label: "Live projection", value: "136.8 pts", trend: "up" as const, trendValue: "+8.4" },
  { label: "Win probability", value: "62%", trend: "up" as const, trendValue: "+5%" },
  { label: "Roster health", value: "9/10 active", trend: "down" as const, trendValue: "-1" },
]

const quickActions = [
  { label: "Run optimizer", href: "/optimize" },
  { label: "Sync leagues", href: "/import" },
  { label: "Start/Sit wizard", href: "/dashboard/team" },
]

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">This week</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Lineup overview</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Track projections, matchup edges, and league news in real time. Run the optimizer when you see a shift or sync new data instantly.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statHighlights.map((stat) => (
          <StatsCard key={stat.label} {...stat} sublabel="Rolling 7-day trend" />
        ))}
        <GlassCard tone="muted" size="compact" className="space-y-3">
          <GlassCard.Header className="space-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Quick actions</p>
            <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Act in seconds</GlassCard.Title>
          </GlassCard.Header>
          <GlassCard.Content className="grid gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className="w-full">
                <AnimatedButton variant="secondary" className="w-full justify-center">
                  {action.label}
                </AnimatedButton>
              </Link>
            ))}
          </GlassCard.Content>
        </GlassCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team overview</h2>
            <Link href="/dashboard/team" className="text-xs font-medium text-indigo-600 hover:underline">Open roster</Link>
          </div>
          <TeamOverviewTable />
        </div>
        <MatchupCard />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <PerformanceChart />
        <NewsCard />
      </section>
    </div>
  )
}
