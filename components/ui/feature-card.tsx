import Link from "next/link"

import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description: string
  cta?: {
    label: string
    href: string
  }
}

export function FeatureCard({ icon, title, description, cta, className, ...props }: FeatureCardProps) {
  return (
    <GlassCard
      className={cn(
        "group relative overflow-hidden border-white/30 bg-white/80 dark:border-white/10 dark:bg-slate-900/60",
        "shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.18), rgba(59,130,246,0.12))" }} />
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-inner shadow-[inset_0_8px_20px_rgba(79,70,229,0.08)]">
            {icon}
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        {cta ? (
          <Link href={cta.href} className="mt-auto inline-flex">
            <AnimatedButton variant="ghost">{cta.label}</AnimatedButton>
          </Link>
        ) : null}
      </div>
    </GlassCard>
  )
}
