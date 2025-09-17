import Link from "next/link"

import { AnimatedButton } from "@/components/ui/animated-button"

export function LandingCTA() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 sm:px-12 lg:px-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),_transparent_55%)]" />
      <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/40 bg-white/70 p-12 text-center shadow-[0_30px_80px_-35px_rgba(14,116,144,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Ready to see the glass advantage?</h2>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
          Join thousands of managers elevating their lineups with AI projections, Playwright imports, and a glass morphism interface built for clarity.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="#" className="inline-flex">
            <AnimatedButton>Start your free 14-day trial</AnimatedButton>
          </Link>
          <Link href="#" className="inline-flex">
            <AnimatedButton variant="secondary">Book a demo</AnimatedButton>
          </Link>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          No credit card required • Cancel anytime • Weekly product drops
        </p>
      </div>
    </section>
  )
}
