import { safeAverage, clamp, roundTo } from "@/lib/analysis/utils"
import type {
  MatchupAnalysisRequest,
  MatchupAnalysisResult,
  MatchupFactors,
  MatchupFactorDetail,
  MatchupTrend,
  GameScriptProjection,
  GameScriptData,
  PositionalDefenseMetric,
  SchemeIntel,
  MatchupDataSource,
  HistoricalMatchupSample,
} from "@/lib/analysis/matchups/types"
import type { AnalysisFactors } from "@/lib/analysis"
import { defaultMatchupDataSource } from "@/lib/analysis/matchups/default-source"
import { playerAnalysisEngine } from "@/lib/analysis"

export class MatchupAnalysisEngine {
  constructor(private readonly source: MatchupDataSource = defaultMatchupDataSource) {}

  async analyze(request: MatchupAnalysisRequest): Promise<MatchupAnalysisResult> {
    const [samples, defenseMetrics, schemeIntel, gameScripts, analysisFactors] = await Promise.all([
      this.source.fetchPlayerMatchupSamples(request),
      this.source.fetchPositionalDefenseMetrics(request.position, request.season, request.week),
      this.source.fetchSchemeIntel([request.teamId, request.opponentTeamId]),
      this.source.fetchGameScriptData([request.teamId, request.opponentTeamId], request.season, request.week),
      this.source.fetchAnalysisFactors?.(request) ?? playerAnalysisEngine
        .analyzePlayer({
          playerId: request.playerId,
          teamId: request.teamId,
          season: request.season,
          week: request.week,
          position: request.position,
        })
        .then((res) => res.factors)
        .catch(() => null),
    ])

    const factors = this.calculateFactors({
      request,
      samples,
      defenseMetrics,
      schemeIntel,
      gameScripts,
      analysisFactors,
    })

    const reliabilityValues = this.extractReliabilityArray(analysisFactors)

    const gameScript = this.buildGameScriptProjection(gameScripts, request)
    const overallScore = roundTo(
      (Object.values(factors).reduce((sum, factor) => sum + factor.score * factor.impact, 0) /
        Object.values(factors).reduce((sum, factor) => sum + factor.impact, 0 || 1)),
      3,
    )
    const volatility = roundTo(this.estimateVolatility(samples, reliabilityValues), 3)
    const trends = this.extractTrends(samples, factors, gameScript)
    const adjustments = this.suggestAdjustments(factors, gameScript)

    return {
      playerId: request.playerId,
      teamId: request.teamId,
      opponentTeamId: request.opponentTeamId,
      season: request.season,
      week: request.week,
      generatedAt: new Date().toISOString(),
      factors,
      gameScript,
      trends,
      overallScore,
      volatility,
      recommendedAdjustments: adjustments,
    }
  }

  private calculateFactors(inputs: {
    request: MatchupAnalysisRequest
    samples: HistoricalMatchupSample[]
    defenseMetrics: PositionalDefenseMetric[]
    schemeIntel: SchemeIntel[]
    gameScripts: GameScriptData[]
    analysisFactors: Record<string, { reliability?: number }> | AnalysisFactors | null
  }): MatchupFactors {
    const { request, samples, defenseMetrics, schemeIntel, gameScripts } = inputs
    const opponentMetric = defenseMetrics.find((metric) => metric.teamId === request.opponentTeamId)

    return {
      playerVsDefense: this.computePlayerVsDefense(samples, opponentMetric),
      positionStrength: this.computePositionStrength(opponentMetric),
      schemeAdvantage: this.computeSchemeAdvantage(schemeIntel, request.teamId, request.opponentTeamId),
      gameScript: this.computeGameScriptFactor(gameScripts, request.teamId, request.opponentTeamId),
    }
  }

  private computePlayerVsDefense(samples: HistoricalMatchupSample[], opponentMetric?: PositionalDefenseMetric): MatchupFactorDetail {
    if (!samples.length) {
      return {
        score: 0.5,
        impact: 0.25,
        summary: "No historical matchups against opponent",
      }
    }

    const recent = samples.slice(-4)
    const avgPoints = safeAverage(recent.map((sample) => sample.points))
    const trend = this.computeTrend(recent)
    const opponentAdjustment = opponentMetric ? clamp(1 - opponentMetric.rank / 32) : 0.5
    const score = clamp(0.5 + (avgPoints / 20 - 0.5) * 0.6 + (trend * 0.4)) * opponentAdjustment

    return {
      score,
      impact: 0.3,
      summary: `Recent vs DEF: ${roundTo(avgPoints, 2)} pts, trend ${trend >= 0 ? "positive" : "negative"}`,
    }
  }

  private computePositionStrength(metric?: PositionalDefenseMetric): MatchupFactorDetail {
    if (!metric) {
      return {
        score: 0.5,
        impact: 0.25,
        summary: "Opponent positional metrics unavailable",
      }
    }

    const rankComponent = clamp(1 - metric.rank / 32)
    const pointsComponent = clamp(1 - (metric.pointsAllowed ?? 20) / 30)
    const explosiveComponent = clamp(1 - (metric.explosiveRate ?? 0.3))
    const score = clamp(rankComponent * 0.6 + pointsComponent * 0.3 + explosiveComponent * 0.1)

    return {
      score,
      impact: 0.25,
      summary: `Opponent rank ${metric.rank}, points allowed ${metric.pointsAllowed ?? "N/A"}`,
    }
  }

  private computeSchemeAdvantage(schemeIntel: SchemeIntel[], teamId: string, opponentId: string): MatchupFactorDetail {
    const offense = schemeIntel.find((entry) => entry.teamId === teamId)
    const defense = schemeIntel.find((entry) => entry.teamId === opponentId)

    if (!offense || !defense) {
      return {
        score: 0.5,
        impact: 0.2,
        summary: "Scheme intel incomplete",
      }
    }

    const blitzPressure = clamp((defense.pressureRate ?? 0.25) - (offense.pressureRate ?? 0.2) + 0.5)
    const coverageMix = clamp((defense.manCoverageRate ?? 0.4) - 0.35 + 0.5)
    const notes = defense.notes ? `Defensive note: ${defense.notes}` : ""
    const score = clamp(blitzPressure * 0.6 + coverageMix * 0.4)

    return {
      score,
      impact: 0.15,
      summary: notes || "Scheme data suggests neutral matchup",
    }
  }

  private computeGameScriptFactor(gameScripts: GameScriptData[], teamId: string, opponentId: string): MatchupFactorDetail {
    const teamScript = gameScripts.find((data) => data.teamId === teamId)
    const oppScript = gameScripts.find((data) => data.teamId === opponentId)

    const paceScore = clamp(((teamScript?.pace ?? 28) + (oppScript?.pace ?? 28)) / 70)
    const passBias = clamp((teamScript?.neutralPassRate ?? 0.52) * 0.6 + (oppScript?.neutralPassRate ?? 0.48) * 0.4)
    const marginImpact = teamScript?.projectedMargin ? clamp(0.5 - teamScript.projectedMargin / 20) : 0.5
    const playsScore = clamp((teamScript?.playsPerGame ?? 63) / 75)

    const score = clamp(paceScore * 0.3 + passBias * 0.3 + marginImpact * 0.2 + playsScore * 0.2)

    return {
      score,
      impact: 0.3,
      summary: `Game pace ${(paceScore * 100).toFixed(0)} percentile, projected margin ${teamScript?.projectedMargin ?? 0}`,
    }
  }

  private buildGameScriptProjection(gameScripts: GameScriptData[], request: MatchupAnalysisRequest): GameScriptProjection {
    const teamScript = gameScripts.find((data) => data.teamId === request.teamId)
    const oppScript = gameScripts.find((data) => data.teamId === request.opponentTeamId)

    const pace = roundTo(safeAverage([teamScript?.pace ?? 27, oppScript?.pace ?? 27]), 2)
    const expectedPlays = roundTo(safeAverage([teamScript?.playsPerGame ?? 64, oppScript?.playsPerGame ?? 64]), 2)
    const passRate = roundTo(teamScript?.passRate ?? 0.55, 3)
    const neutralPassRate = roundTo(teamScript?.neutralPassRate ?? 0.5, 3)
    const projectedMargin = roundTo(teamScript?.projectedMargin ?? 0, 2)
    const notes: string[] = []

    if ((oppScript?.neutralPassRate ?? 0.5) > 0.6) {
      notes.push("Opponent leans pass-heavy, expect shootout potential")
    }
    if ((teamScript?.pace ?? 27) > 28) {
      notes.push("Team operates at a fast pace")
    }

    return {
      pace,
      expectedPlays,
      passRate,
      neutralPassRate,
      projectedMargin,
      notes,
    }
  }

  private estimateVolatility(samples: HistoricalMatchupSample[], reliabilities?: number[]) {
    if (!samples.length) {
      return 0.5
    }
    const points = samples.map((sample) => sample.points)
    const avg = safeAverage(points)
    const variance = safeAverage(points.map((value) => (value - avg) ** 2))
    const factorReliability = reliabilities?.length ? safeAverage(reliabilities) : 0.5
    return clamp(Math.sqrt(variance) / 25 + (1 - factorReliability) * 0.2)
  }

  private extractTrends(samples: HistoricalMatchupSample[], factors: MatchupFactors, gameScript: GameScriptProjection): MatchupTrend[] {
    const trends: MatchupTrend[] = []

    const trend = this.computeTrend(samples.slice(-3))
    trends.push({
      label: "Recent matchup trend",
      direction: trend > 0.05 ? "positive" : trend < -0.05 ? "negative" : "neutral",
      magnitude: roundTo(Math.abs(trend), 3),
      summary: `Trend delta ${roundTo(trend, 3)}`,
    })

    if (factors.positionStrength.score > 0.65) {
      trends.push({
        label: "Opponent positional weakness",
        direction: "positive",
        magnitude: roundTo(factors.positionStrength.score, 3),
        summary: factors.positionStrength.summary,
      })
    }

    if (gameScript.projectedMargin < -3) {
      trends.push({
        label: "Trailing game script",
        direction: "positive",
        magnitude: 0.4,
        summary: "Trailing script could boost passing volume",
      })
    }

    return trends
  }

  private suggestAdjustments(factors: MatchupFactors, script: GameScriptProjection) {
    const adjustments: string[] = []
    if (factors.schemeAdvantage.score < 0.45) {
      adjustments.push("Increase quick-hitting route concepts to neutralize pressure")
    }
    if (script.projectedMargin > 6) {
      adjustments.push("Game script favors run-heavy approach; monitor receiving volume")
    }
    if (factors.gameScript.score > 0.7) {
      adjustments.push("Expect elevated total plays – consider stacking teammates")
    }
    return adjustments
  }

  private computeTrend(samples: HistoricalMatchupSample[]) {
    if (samples.length < 2) {
      return 0
    }
    const sorted = [...samples].sort((a, b) => a.week - b.week)
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    return clamp((last.points - first.points) / Math.max(first.points || 1, 1))
  }

  private extractReliabilityArray(
    analysisFactors: Record<string, { reliability?: number }> | AnalysisFactors | null,
  ) {
    if (!analysisFactors) {
      return undefined
    }
    const values = Object.values(analysisFactors)
    if (!values.length) {
      return undefined
    }
    if (typeof values[0] === "number") {
      return values.map((value) => clamp(Number(value)))
    }
    return values
      .map((value) => (typeof value === "object" && value ? value.reliability ?? 0.5 : 0.5))
      .map((value) => clamp(value))
  }
}

export const matchupAnalysisEngine = new MatchupAnalysisEngine()
