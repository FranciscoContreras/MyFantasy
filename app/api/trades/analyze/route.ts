import { NextResponse } from "next/server"

import { TradeAnalyzer } from "@/lib/trades/engine"
import { sampleTradeInput } from "@/lib/trades/sample-data"

const analyzer = new TradeAnalyzer()

export async function GET() {
  const result = analyzer.analyze(sampleTradeInput)
  return NextResponse.json(result)
}
