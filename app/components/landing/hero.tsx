import Link from "next/link"

import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:px-12 lg:px-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_60%),radial-gradient(circle_at_right,_rgba(14,165,233,0.3),_transparent_55%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-white/50 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-sky-200 lg:justify-start">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-sky-400 to-blue-500" />
            AI-Assisted Fantasy Football
          </div>
          <h1 className={cn("text-4xl font-bold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl", "dark:text-white")}>Optimize every lineup with glass-morphism clarity.</h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl dark:text-slate-300">
            Harness real-time NFL data, Playwright-powered scraping, and AI predictions to build winning lineups. The glass-morphism interface keeps complex insights transparent and beautiful.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href="#pricing" className="inline-flex">
              <AnimatedButton>Get Started</AnimatedButton>
            </Link>
            <Link href="#features" className="inline-flex">
              <AnimatedButton variant="secondary">Explore Features</AnimatedButton>
            </Link>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-300 sm:flex-row sm:items-center sm:gap-6 sm:text-base">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live projections updated every 15 minutes
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Multi-league support & Playwright imports
            </div>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/40 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-200/60 via-blue-100/20 to-transparent dark:from-slate-800/70 dark:via-slate-900/30" />
          <div className="relative flex h-full flex-col justify-between p-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                  Week 7 AI projection
                </p>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">J. Jefferson vs GB</h2>
              </div>
              <div className="rounded-3xl border border-white/50 bg-white/70 p-6 shadow-inner shadow-white/50 dark:border-white/10 dark:bg-slate-900/70">
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Mean</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">21.4</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Confidence</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">92%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Floor</p>
                    <p className="text-lg font-semibold text-emerald-500">15.6</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Ceiling</p>
                    <p className="text-lg font-semibold text-blue-500">30.9</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/40 bg-white/60 p-5 text-xs text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
              &quot;Defense ranking 27th vs elite WRs. Expect high-tempo script with DAL trailing by -4 projected margin.&quot;
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
