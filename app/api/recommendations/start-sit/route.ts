import { NextResponse } from "next/server"

import { StartSitRecommendationEngine } from "@/lib/recommendations/start-sit"
import { sampleStartSitRoster } from "@/lib/recommendations/sample-data"

const engine = new StartSitRecommendationEngine({ autoAnalyze: false })

export async function GET() {
  const result = await engine.generate({
    season: 2024,
    week: 15,
    roster: sampleStartSitRoster,
    maxRecommendations: 6,
  })

  return NextResponse.json(result)
}
