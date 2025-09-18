import { PredictionEngine, OpenAIInsightService, TensorflowPredictionModel } from "@/lib/analysis/prediction"
import type { AnalysisFactors } from "@/lib/analysis"

class StubModel extends TensorflowPredictionModel {
  override predictPoints(factors: AnalysisFactors, baseline: number): number {
    return baseline * 0.6 + factors.recentForm * 10
  }
}

class StubInsights extends OpenAIInsightService {
  constructor() {
    super(async () => new Response())
  }

  override async generateInsights(): Promise<string> {
    return "Stub insight"
  }
}

describe("PredictionEngine", () => {
  const factors: AnalysisFactors = {
    historicalPerformance: 0.7,
    matchupDifficulty: 0.65,
    defensiveSchemeImpact: 0.55,
    coordinatorTendencies: 0.5,
    recentForm: 0.75,
    injuryImpact: 0.6,
    weatherImpact: 0.5,
  }

  it("produces calibrated projection output", async () => {
    const engine = new PredictionEngine({
      model: new StubModel(),
      insights: new StubInsights(),
    })

    const analysisFactorDetails = Object.fromEntries(
      Object.entries(factors).map(([metric, score]) => [
        metric,
        {
          score,
          weight: 0.2,
          description: metric,
          reliability: 0.8,
        },
      ]),
    ) as Record<
      keyof AnalysisFactors,
      {
        score: number
        weight: number
        description: string
        reliability: number
      }
    >

    const result = await engine.predict({
      playerId: "4035687",
      season: 2024,
      week: 9,
      baselineProjection: 18,
      factors,
      analysis: {
        playerId: "4035687",
        season: 2024,
        week: 8,
        generatedAt: new Date().toISOString(),
        compositeScore: 0.7,
        confidence: 0.8,
        recommendation: "start",
        notes: [],
        factors: analysisFactorDetails,
      },
    })

    expect(result.playerId).toBe("4035687")
    expect(result.mean).toBeGreaterThan(0)
    expect(result.floor).toBeLessThan(result.ceiling)
    expect(result.distribution.length).toBeGreaterThan(0)
    expect(result.insights).toBe("Stub insight")
  })

  it("falls back to local insight generation on fetch failure", async () => {
    const failingFetcher = jest.fn(async () => {
      throw new Error("network failure")
    })
    const service = new OpenAIInsightService(failingFetcher as unknown as typeof fetch)
    delete process.env.OPENAI_API_KEY

    const insight = await service.generateInsights({
      playerId: "4035687",
      position: "WR",
      season: 2024,
      week: 9,
      factors,
      baselineProjection: 18,
    })

    expect(insight).toContain("projects")
  })
})
