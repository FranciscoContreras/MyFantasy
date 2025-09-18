import { MatchupAnalysisEngine } from "@/lib/analysis/matchups/engine"
import type {
  GameScriptData,
  HistoricalMatchupSample,
  MatchupAnalysisRequest,
  MatchupDataSource,
  PositionalDefenseMetric,
  SchemeIntel,
} from "@/lib/analysis/matchups/types"
import type { AnalysisFactors } from "@/lib/analysis"

const request: MatchupAnalysisRequest = {
  playerId: "4035687",
  teamId: "MIN",
  opponentTeamId: "GB",
  position: "WR",
  season: 2024,
  week: 9,
}

function defineMockSource(): MatchupDataSource {
  const samples: HistoricalMatchupSample[] = [
    { season: 2023, week: 12, points: 18.4 },
    { season: 2023, week: 16, points: 21.1 },
    { season: 2024, week: 3, points: 17.6 },
    { season: 2024, week: 5, points: 22.8 },
  ]

  const defenseMetrics: PositionalDefenseMetric[] = [
    { teamId: "GB", position: "WR", rank: 8, pointsAllowed: 19.5, explosiveRate: 0.18 },
  ]

  const schemeIntel: SchemeIntel[] = [
    { teamId: "MIN", blitzRate: 0.28, pressureRate: 0.24, notes: "Quick game emphasis" },
    { teamId: "GB", blitzRate: 0.34, pressureRate: 0.31, manCoverageRate: 0.47, notes: "Press-man heavy" },
  ]

  const scripts: GameScriptData[] = [
    { teamId: "MIN", pace: 29, passRate: 0.58, neutralPassRate: 0.6, projectedMargin: -4, playsPerGame: 66 },
    { teamId: "GB", pace: 27, passRate: 0.54, neutralPassRate: 0.52, projectedMargin: 4, playsPerGame: 64 },
  ]

  const analysisFactors: AnalysisFactors = {
    historicalPerformance: 0.78,
    matchupDifficulty: 0.64,
    defensiveSchemeImpact: 0.55,
    coordinatorTendencies: 0.61,
    recentForm: 0.73,
    injuryImpact: 0.82,
    weatherImpact: 0.6,
  }

  return {
    async fetchPlayerMatchupSamples() {
      return samples
    },
    async fetchPositionalDefenseMetrics() {
      return defenseMetrics
    },
    async fetchSchemeIntel() {
      return schemeIntel
    },
    async fetchGameScriptData() {
      return scripts
    },
    async fetchAnalysisFactors() {
      return analysisFactors
    },
  }
}

describe("MatchupAnalysisEngine", () => {
  const engine = new MatchupAnalysisEngine(defineMockSource())

  it("produces consistent matchup factors and scores", async () => {
    const result = await engine.analyze(request)

    expect(result.overallScore).toBeGreaterThan(0)
    expect(result.overallScore).toBeLessThanOrEqual(1)

    expect(result.factors.playerVsDefense.score).toBeGreaterThan(0)
    expect(result.factors.playerVsDefense.summary).toContain("Recent vs DEF")

    expect(result.gameScript.pace).toBeCloseTo(28)
    expect(result.trends.length).toBeGreaterThan(0)
    expect(result.recommendedAdjustments).toContain("Expect elevated total plays – consider stacking teammates")
  })
})
