import { Brain, Sparkles, Zap, ShieldCheck } from "lucide-react"

import { FeatureCard } from "@/components/ui/feature-card"

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Matchup Intelligence",
    description:
      "TensorFlow.js projections merge with matchup analytics, surfacing actionable start/sit calls instantly.",
    badge: "AI"
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Glass Dashboard",
    description:
      "A glass-morphism UI keeps every player metric transparent across light and dark modes.",
    badge: "UI"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-time Imports",
    description:
      "Playwright MCP automation syncs ESPN, Yahoo, Sleeper, and CBS rosters without manual work.",
    badge: "Realtime"
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Scenario Optimizer",
    description:
      "Lineup optimizer balances floor vs ceiling while respecting stack, salary, and exposure rules.",
    badge: "Optimizer"
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left,_rgba(14,165,233,0.2),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(125,211,252,0.25),_transparent_65%)]" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Features built for fantasy dominance</h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Every feature is tuned for transparency, speed, and accuracy—powered by glass morphism and MCP automation.
          </p>
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
