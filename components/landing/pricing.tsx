import Link from "next/link"

import { FadeIn } from "@/components/motion/fade-in"
import { PricingCard } from "@/components/ui/pricing-card"

const tier = {
  title: "Pro",
  price: "$39/mo",
  description: "Free 14-day trial. Cancel anytime. Import all leagues and unlock full optimizer access.",
  features: [
    "Unlimited league imports",
    "AI matchup insights",
    "Lineup optimizer + exposure rules",
    "Live alerts and weekly recaps",
  ],
  cta: { label: "Start free", href: "/optimize" },
}

export function PricingSection() {
  return (
    <section className="py-20">
      <FadeIn className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Pricing that pays for itself.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            One simple tier. One goal: win your league with clarity and speed.
          </p>
        </div>
        <PricingCard {...tier} highlighted />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Need a league bundle or enterprise tooling? <Link href="mailto:team@glassgrid.com" className="underline">Contact us</Link>.
        </p>
      </FadeIn>
    </section>
  )
}
