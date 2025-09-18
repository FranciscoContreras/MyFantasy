import { FadeIn } from "@/components/motion/fade-in"
import { LeagueSettingsForm } from "@/components/settings/league-settings-form"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "League settings",
}

export default function LeagueSettingsPage() {
  return (
    <div className="space-y-12">
      <FadeIn className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="rounded-full border-white/60 bg-white/80 px-3 py-1 text-slate-700 shadow-sm">
            Phase 5 · Task 5.3
          </Badge>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">League configuration</p>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">League settings</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Align the glass dashboard with your league&apos;s exact rules. Imports, scoring, roster logic, and notifications stay in sync once you save.
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={0.08}>
        <LeagueSettingsForm />
      </FadeIn>
    </div>
  )
}
