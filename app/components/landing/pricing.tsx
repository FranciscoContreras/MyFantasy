import { Check } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"

const tiers = [
  {
    name: "Scout",
    price: "$19/mo",
    description: "Perfect for casual managers seeking weekly AI guidance.",
    highlighted: false,
    features: [
      "Weekly AI projections",
      "One league import",
      "Lineup recommendations",
    ],
  },
  {
    name: "Pro",
    price: "$39/mo",
    description: "For serious competitors juggling multiple leagues.",
    highlighted: true,
    features: [
      "Unlimited imports",
      "Optimizer with stack controls",
      "Real-time injury alerts",
      "Access to glass dashboards",
    ],
  },
  {
    name: "Elite",
    price: "$79/mo",
    description: "DFS pros and commissioners who demand full control.",
    highlighted: false,
    features: [
      "Custom projection calibrations",
      "Playwright automation scheduling",
      "Scenario backtesting",
      "Priority concierge support",
    ],
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.15),_transparent_55%)]" />
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Choose your edge</h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
          Scale from season-long leagues to high-stakes DFS with pricing built for transparency.
        </p>
        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {tiers.map((tier) => (
            <GlassCard
              key={tier.name}
              className={`relative flex h-full flex-col gap-6 border-white/40 bg-white/70 p-8 transition-transform duration-300 hover:-translate-y-2 dark:border-white/10 dark:bg-slate-900/60 ${
                tier.highlighted
                  ? "shadow-[0_35px_80px_-35px_rgba(37,99,235,0.45)] ring-4 ring-sky-200/60 dark:ring-sky-500/20"
                  : "shadow-[0_25px_70px_-40px_rgba(15,23,42,0.45)]"
              }`}
            >
              {tier.highlighted ? (
                <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 px-3 py-1 text-xs font-semibold text-white shadow">
                  Most Popular
                </span>
              ) : null}
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{tier.name}</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{tier.price}</p>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{tier.description}</p>
              </div>
              <ul className="flex flex-1 flex-col gap-3 text-left text-sm text-slate-600 dark:text-slate-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <AnimatedButton variant={tier.highlighted ? "primary" : "secondary"}>Start Free Trial</AnimatedButton>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
