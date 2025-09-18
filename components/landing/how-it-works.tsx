import { UploadCloud, LineChart, Sparkle } from "lucide-react"

import { FadeIn } from "@/components/motion/fade-in"
import { FeatureCard } from "@/components/ui/feature-card"

const steps = [
  {
    icon: <UploadCloud className="h-6 w-6" />,
    title: "Import your league",
    description: "Secure imports pull rosters from ESPN, Yahoo, Sleeper, and CBS in one click.",
    cta: { label: "Sync now", href: "/import" },
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Get matchup insights",
    description: "Player outlooks update with injuries, weather, and coordinator tendencies so you always see the full picture.",
    cta: { label: "View analytics", href: "/dashboard/team" },
  },
  {
    icon: <Sparkle className="h-6 w-6" />,
    title: "Optimize your lineup",
    description: "Ranked picks with floor, ceiling, and confidence scores help you lock lineups faster than ever.",
    cta: { label: "Run the optimizer", href: "/optimize" },
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <FadeIn className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Here’s how you move faster every week.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.06}>
              <FeatureCard icon={step.icon} title={step.title} description={step.description} cta={step.cta} />
            </FadeIn>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}
