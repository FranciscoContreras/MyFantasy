import { GlassCard } from "@/components/ui/glass-card"
import { FairnessMeter } from "@/components/trades/fairness-meter"
import type { TradeAnalysisResult } from "@/lib/trades/types"

export function TradeSummary({ result }: { result: TradeAnalysisResult }) {
  return (
    <GlassCard tone="brand" className="space-y-6">
      <GlassCard.Header className="space-y-2">
        <GlassCard.Title className="text-2xl font-semibold text-slate-900 dark:text-white">
          Trade recommendation
        </GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">{result.recommendation.summary}</p>
      </GlassCard.Header>
      <GlassCard.Content className="grid gap-5">
        <FairnessMeter score={result.fairness.score} verdict={result.fairness.verdict} />
        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Key factors
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {result.recommendation.keyFactors.map((factor) => (
              <li key={factor}>• {factor}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Confidence</p>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-slate-700 shadow-sm dark:bg-slate-900/60 dark:text-slate-200">
              {result.recommendation.confidence}%
            </span>
            <span>{result.recommendation.accept ? "Lean accept" : "Lean decline"}</span>
          </div>
        </div>
      </GlassCard.Content>
    </GlassCard>
  )
}
