import groupBy from "lodash/groupBy"

import type { AnalysisFactors } from "@/lib/analysis"
import type { PlayerAnalysisEngine } from "@/lib/analysis/engine"
import type { PlayerAnalysisResult } from "@/lib/analysis/types"
import { PredictionEngine, TensorflowPredictionModel, OpenAIInsightService } from "@/lib/analysis/prediction"
import type { PredictionOutput } from "@/lib/analysis/prediction"
import type {
  StartSitAlternative,
  StartSitPlayerInput,
  StartSitRecommendation,
  StartSitRecommendationResult,
  StartSitRequest,
} from "@/lib/recommendations/types"

interface StartSitEngineOptions {
  analysisEngine?: PlayerAnalysisEngine
  predictionEngine?: PredictionEngine
  autoAnalyze?: boolean
  deltaThreshold?: number
}

interface PlayerPredictionSummary {
  player: StartSitPlayerInput
  analysis: PlayerAnalysisResult | null
  prediction: PredictionOutput
}

export class StartSitRecommendationEngine {
  private readonly analysisEngine?: PlayerAnalysisEngine
  private readonly predictionEngine: PredictionEngine
  private readonly autoAnalyze: boolean
  private readonly deltaThreshold: number

  constructor({
    analysisEngine,
    predictionEngine,
    autoAnalyze = true,
    deltaThreshold = 1.5,
  }: StartSitEngineOptions = {}) {
    this.analysisEngine = analysisEngine
    this.predictionEngine =
      predictionEngine ?? new PredictionEngine({ model: new TensorflowPredictionModel(), insights: new OpenAIInsightService() })
    this.autoAnalyze = autoAnalyze
    this.deltaThreshold = deltaThreshold
  }

  async generate(request: StartSitRequest): Promise<StartSitRecommendationResult> {
    const predictions = await this.buildPredictions(request)

    const starters = predictions.filter((entry) => entry.player.lineupSlot === "starter")
    const bench = predictions.filter((entry) => entry.player.lineupSlot === "bench")

    const startersByPosition = groupBy(starters, (entry) => entry.player.position)
    const benchByPosition = groupBy(bench, (entry) => entry.player.position)

    const recommendations: StartSitRecommendation[] = []

    for (const [position, benchPlayers] of Object.entries(benchByPosition)) {
      const startersForPosition = (startersByPosition[position] ?? []).sort(
        (a, b) => a.prediction.mean - b.prediction.mean,
      )
      if (!startersForPosition.length) continue

      const bestBench = [...benchPlayers].sort((a, b) => b.prediction.mean - a.prediction.mean)

      for (const benchEntry of bestBench) {
        const weakestStarter = startersForPosition[0]
        if (!weakestStarter) break

        const delta = benchEntry.prediction.mean - weakestStarter.prediction.mean
        if (delta < (request.deltaThreshold ?? this.deltaThreshold)) {
          continue
        }

        recommendations.push(
          this.createRecommendation({
            type: "start",
            primary: benchEntry,
            comparison: weakestStarter,
            rosterGroup: bestBench,
            delta,
          }),
        )

        recommendations.push(
          this.createRecommendation({
            type: "sit",
            primary: weakestStarter,
            comparison: benchEntry,
            rosterGroup: bestBench,
            delta,
          }),
        )

        startersForPosition.shift()
      }
    }

    const sorted = recommendations.sort((a, b) => b.delta - a.delta)
    const limited = request.maxRecommendations ? sorted.slice(0, request.maxRecommendations) : sorted

    return {
      season: request.season,
      week: request.week,
      recommendations: limited,
      generatedAt: new Date().toISOString(),
    }
  }

  private async buildPredictions(request: StartSitRequest): Promise<PlayerPredictionSummary[]> {
    const results: PlayerPredictionSummary[] = []

    for (const player of request.roster) {
      const analysis = await this.resolveAnalysis(player, request)
      const factors = this.resolveFactors(player, analysis)
      const prediction = await this.predictionEngine.predict({
        playerId: player.id,
        season: request.season,
        week: request.week,
        baselineProjection: player.baselineProjection,
        factors,
        analysis: analysis ?? undefined,
        position: player.position,
        matchup: player.matchup,
      })

      results.push({ player, analysis, prediction })
    }

    return results
  }

  private async resolveAnalysis(player: StartSitPlayerInput, request: StartSitRequest) {
    if (player.analysis) {
      return player.analysis
    }

    if (!this.autoAnalyze || !this.analysisEngine) {
      return null
    }

    try {
      return await this.analysisEngine.analyzePlayer({
        playerId: player.id,
        season: request.season,
        week: request.week,
        position: player.position,
        teamId: player.team,
      })
    } catch (error) {
      console.warn("[StartSitRecommendationEngine] analysis fallback", error)
      return null
    }
  }

  private resolveFactors(player: StartSitPlayerInput, analysis: PlayerAnalysisResult | null): AnalysisFactors {
    if (player.factors) {
      return player.factors
    }
    if (analysis) {
      return Object.entries(analysis.factors).reduce((acc, [metric, detail]) => {
        acc[metric as keyof AnalysisFactors] = detail.score
        return acc
      }, {} as AnalysisFactors)
    }
    return {
      historicalPerformance: 0.5,
      matchupDifficulty: 0.5,
      defensiveSchemeImpact: 0.5,
      coordinatorTendencies: 0.5,
      recentForm: 0.5,
      injuryImpact: 0.5,
      weatherImpact: 0.5,
    }
  }

  private createRecommendation({
    type,
    primary,
    comparison,
    rosterGroup,
    delta,
  }: {
    type: "start" | "sit"
    primary: PlayerPredictionSummary
    comparison: PlayerPredictionSummary
    rosterGroup: PlayerPredictionSummary[]
    delta: number
  }): StartSitRecommendation {
    const alternatives = this.buildAlternatives(primary, rosterGroup, comparison)
    const history = this.computeHistory(primary.player)

    const confidence = type === "start" ? primary.prediction.confidence : comparison.prediction.confidence
    const insight = type === "start" ? primary.prediction.insights : comparison.prediction.insights

    const reasoning =
      type === "start"
        ? `${primary.player.name} projects ${delta.toFixed(1)} pts above ${comparison.player.name}. ${primary.prediction.insights}`
        : `${primary.player.name} trails ${comparison.player.name} by ${delta.toFixed(1)} pts. ${comparison.prediction.insights}`

    return {
      id: `${type}:${primary.player.id}:${comparison.player.id}`,
      type,
      player: {
        id: primary.player.id,
        name: primary.player.name,
        position: primary.player.position,
        team: primary.player.team,
        opponent: primary.player.opponent,
      },
      projectedPoints: primary.prediction.mean,
      baseline: primary.player.baselineProjection,
      delta,
      confidence,
      reasoning,
      insight,
      alternatives,
      history,
      generatedAt: new Date().toISOString(),
    }
  }

  private buildAlternatives(
    primary: PlayerPredictionSummary,
    rosterGroup: PlayerPredictionSummary[],
    comparison: PlayerPredictionSummary,
  ): StartSitAlternative[] {
    const sorted = rosterGroup
      .filter((entry) => entry.player.id !== primary.player.id)
      .map((entry) => ({
        id: entry.player.id,
        name: entry.player.name,
        position: entry.player.position,
        team: entry.player.team,
        projectedPoints: entry.prediction.mean,
        confidence: entry.prediction.confidence,
        delta: entry.prediction.mean - comparison.prediction.mean,
      }))
      .sort((a, b) => b.projectedPoints - a.projectedPoints)

    return sorted.slice(0, 2)
  }

  private computeHistory(player: StartSitPlayerInput) {
    const history = player.history ?? []
    const sampleSize = history.length
    const successCount = history.filter((item) => item.success).length
    const successRate = sampleSize ? Math.round((successCount / sampleSize) * 100) : 0

    return {
      successRate,
      sampleSize,
      lastFive: history
        .slice(-5)
        .map((entry) => ({ week: entry.week, success: entry.success }))
        .reverse(),
    }
  }
}
