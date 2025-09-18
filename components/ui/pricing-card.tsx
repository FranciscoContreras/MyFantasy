import Link from "next/link"

import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  cta: {
    label: string
    href: string
  }
  highlighted?: boolean
}

export function PricingCard({ title, price, description, features, cta, highlighted }: PricingCardProps) {
  return (
    <GlassCard
      className={cn(
        "flex h-full flex-col gap-6 border-white/40 bg-white/85 p-8 shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/60",
        highlighted ? "ring-2 ring-indigo-200/80 dark:ring-indigo-500/30" : "",
      )}
    >
      <div className="space-y-3 text-left">
        <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-4xl font-bold text-slate-900 dark:text-white">{price}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      <ul className="flex flex-1 flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            {feature}
          </li>
        ))}
      </ul>
      <Link href={cta.href} className="inline-flex">
        <AnimatedButton variant={highlighted ? "primary" : "secondary"}>{cta.label}</AnimatedButton>
      </Link>
    </GlassCard>
  )
}
