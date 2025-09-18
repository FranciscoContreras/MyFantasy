import { MatchupComparison } from "@/components/matchup/matchup-comparison"
import { GlassCard } from "@/components/ui/glass-card"

const offenseHighlights = [
  {
    name: "Justin Jefferson",
    team: "MIN",
    position: "WR",
    projection: 22.4,
    matchup: "vs DET",
    snippet: "Lions allow 9.2 yards per target to boundary alphas since Week 8.",
  },
  {
    name: "Christian McCaffrey",
    team: "SF",
    position: "RB",
    projection: 24.8,
    matchup: "@ SEA",
    snippet: "Seattle concedes 6.4 RB receptions per game; check-down volume spikes vs two-high shells.",
  },
  {
    name: "CJ Stroud",
    team: "HOU",
    position: "QB",
    projection: 20.6,
    matchup: "vs TEN",
    snippet: "Titans blitz rate dips to 18% on the road; Stroud averages +4.3 EPA vs no blitz.",
  },
]

const defenseHighlights = [
  {
    name: "Micah Parsons",
    team: "DAL",
    position: "EDGE",
    projection: 15.2,
    matchup: "vs PHI",
    snippet: "Parsons moves inside on 32% of third downs, targeting Hurts' interior protection.",
  },
  {
    name: "Sauce Gardner",
    team: "NYJ",
    position: "CB",
    projection: 12.1,
    matchup: "vs MIA",
    snippet: "Expect mirrored coverage on Waddle; Hill draws doubled coverage in 74% of snaps.",
  },
  {
    name: "Fred Warner",
    team: "SF",
    position: "LB",
    projection: 17.4,
    matchup: "@ SEA",
    snippet: "Warner shadows rookie TE routes, trimming target expectation by 22%.",
  },
]

const battles = [
  {
    player: "Justin Jefferson",
    opponent: "Amani Oruwariye",
    advantageLabel: "WR vs CB",
    advantageValue: 78,
    matchupNote: "Jefferson wins 64% of contested targets; Lions zone gives 2.4 explosive plays per game.",
    projection: { player: 22.4, opponent: 13.1 },
  },
  {
    player: "Christian McCaffrey",
    opponent: "Bobby Wagner",
    advantageLabel: "RB receiving",
    advantageValue: 69,
    matchupNote: "Wagner allows 1.63 Yards per cover snap; McCaffrey averages 7.1 targets in two-high looks.",
    projection: { player: 24.8, opponent: 16.9 },
  },
  {
    player: "Brandon Aiyuk",
    opponent: "Tariq Woolen",
    advantageLabel: "Intermediate routes",
    advantageValue: 58,
    matchupNote: "Aiyuk ranks top-10 in DVOE on digs; Woolen concedes 0.43 EPA per target inside 15 yards.",
    projection: { player: 17.3, opponent: 14.2 },
  },
  {
    player: "George Kittle",
    opponent: "Jamal Adams",
    advantageLabel: "Seam usage",
    advantageValue: 64,
    matchupNote: "Seattle's seam coverage yields 78% catch rate; Kittle leads league in seam YAC.",
    projection: { player: 16.5, opponent: 12.7 },
  },
]

const chartData = [
  { label: "W10", team: 134, opponent: 118 },
  { label: "W11", team: 127, opponent: 121 },
  { label: "W12", team: 139, opponent: 124 },
  { label: "W13", team: 131, opponent: 119 },
  { label: "W14", team: 144, opponent: 128 },
]

export default function MatchupAnalyzerPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Analyzer</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Matchup breakdown</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Compare personnel, spotlight battles, and watch projections shift as injuries and weather updates flow in. This view refreshes every 15 minutes.
        </p>
      </section>
      <MatchupComparison
        offenseHighlights={offenseHighlights}
        defenseHighlights={defenseHighlights}
        battles={battles}
        winProbability={64}
        chartData={chartData}
      />
      <GlassCard tone="muted" className="space-y-4">
        <GlassCard.Header>
          <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Coordinator tendencies</GlassCard.Title>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Offensive pace projections, red-zone splits, and blitz adjustments ready for optimizer sync.
          </p>
        </GlassCard.Header>
        <GlassCard.Content className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Kyle Shanahan increases neutral-script pass rate by 9% vs Cover-3 shells.",
            "Steve Spagnuolo blitzes 36% on third-and-medium; expect quick-game scripts.",
            "Brian Flores deploys double mug looks on 42% of snaps vs elite WR1s.",
          ].map((note, index) => (
            <div
              key={index}
              className="rounded-[18px] border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300"
            >
              {note}
            </div>
          ))}
        </GlassCard.Content>
      </GlassCard>
    </div>
  )
}
