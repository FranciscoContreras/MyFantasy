import { TradeAnalyzer } from "@/lib/trades/engine"
import { sampleTradeInput } from "@/lib/trades/sample-data"
import { TradeSummary } from "@/components/trades/trade-summary"
import { TradeSideCard } from "@/components/trades/trade-side-card"

export default async function TradeAnalyzerPage() {
  const analyzer = new TradeAnalyzer()
  const result = analyzer.analyze(sampleTradeInput)

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Trade analyzer</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Deal balance & impact</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Evaluate multi-player trades instantly. We score rest-of-season value, project weekly swings, and highlight fairness before you click accept.
        </p>
      </section>
      <TradeSummary result={result} />
      <section className="grid gap-6 lg:grid-cols-2">
        <TradeSideCard label="Team A" packageInfo={sampleTradeInput.teamA} value={result.teamA} />
        <TradeSideCard label="Team B" packageInfo={sampleTradeInput.teamB} value={result.teamB} />
      </section>
    </div>
  )
}
