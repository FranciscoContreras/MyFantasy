import { FadeIn } from "@/components/motion/fade-in"
import { GlassCard } from "@/components/ui/glass-card"

const integrations = [
  { name: "ESPN", description: "Rosters, scoring, matchup schedules" },
  { name: "Yahoo", description: "Player news, FAAB history, projections" },
  { name: "Sleeper", description: "Lineups, waiver wire, keeper settings" },
  { name: "CBS", description: "League scoring, rosters, transactions" },
  { name: "NFL", description: "Official injuries, weather, depth charts" },
  { name: "PFR", description: "Historical defensive splits, pace trends" },
]

export function IntegrationsSection() {
  return (
    <section className="py-20">
      <FadeIn className="mx-auto flex max-w-5xl flex-col gap-10 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Every data source in one lineup hub.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Imports refresh automatically so you always have the same trusted data the pros rely on.
          </p>
        </div>
        <GlassCard tone="muted" className="p-0">
          <div className="grid gap-0 divide-y divide-white/30 text-left dark:divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
            {integrations.map((item) => (
              <div key={item.name} className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>
    </section>
  )
}
