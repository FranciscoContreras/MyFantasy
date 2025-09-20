import { NFLDataError, toNFLDataError } from "@/lib/nfl-data/errors"
import { nflDataService, NFLDataService } from "@/lib/nfl-data"
import type {
  PlayerStat,
  TeamDefenseStat,
  GameSchedule,
  InjuryReport,
  WeatherReport,
  DataFetchContext,
} from "@/lib/nfl-data/types"
import { clamp, safeAverage, normalize, inverseNormalize, roundTo } from "@/lib/analysis/utils"
import type {
  AnalysisFactors,
  AnalysisMetric,
  FactorDetail,
  PlayerAnalysisBreakdown,
  PlayerAnalysisRequest,
  PlayerAnalysisResult,
} from "@/lib/analysis/types"

const FACTOR_WEIGHTS: AnalysisFactors = {
  historicalPerformance: 0.2,
  matchupDifficulty: 0.2,
  defensiveSchemeImpact: 0.15,
  coordinatorTendencies: 0.1,
  recentForm: 0.2,
  injuryImpact: 0.1,
  weatherImpact: 0.05,
}

const RECENT_WEEKS = 3
const MAX_EXPECTED_POINTS = 35
const INJURY_IMPACT_MAP: Record<string, number> = {
  HEALTHY: 1,
  QUESTIONABLE: 0.6,
  DOUBTFUL: 0.35,
  OUT: 0.1,
  IR: 0.05,
}

const DEFAULT_FACTOR_DESCRIPTION: Record<AnalysisMetric, string> = {
  historicalPerformance: "Production baseline from historical averages",
  matchupDifficulty: "Difficulty of upcoming matchup based on opponent defense",
  defensiveSchemeImpact: "Impact of defensive scheme and pressure rates",
  coordinatorTendencies: "Coordinator tendencies and play calling bias",
  recentForm: "Recent game form compared to season averages",
  injuryImpact: "Player and team injury outlook",
  weatherImpact: "Weather considerations for the upcoming game",
}

const FACTOR_LABELS: Record<AnalysisMetric, string> = {
  historicalPerformance: "Historical performance",
  matchupDifficulty: "Matchup difficulty",
  defensiveSchemeImpact: "Defensive scheme impact",
  coordinatorTendencies: "Coordinator tendencies",
  recentForm: "Recent form",
  injuryImpact: "Injury outlook",
  weatherImpact: "Weather impact",
}

export class PlayerAnalysisEngine {
  constructor(private readonly dataService: NFLDataService = nflDataService) {}

  async analyzePlayer(request: PlayerAnalysisRequest): Promise<PlayerAnalysisResult> {
    const context = {
      requestId: request.context?.requestId ?? `analysis:${request.playerId}:${request.season}:${request.week}`,
      reason: request.context?.forceRefresh ? "refresh" : undefined,
      ttlMs: 5 * 60 * 1000,
    }

    const [seasonStats, prevSeasonStats, defenseStats, scheduleWeek, injuries] = await Promise.all([
      this.dataService.fetchPlayerStats({ season: request.season, playerIds: [request.playerId] }, context),
      this.dataService.fetchPlayerStats({ season: request.season - 1, playerIds: [request.playerId] }, context).catch(() => []),
      this.dataService.fetchTeamDefense({ season: request.season, week: request.week }, context),
      this.dataService.fetchSchedule({ season: request.season, week: request.week }, context),
      this.dataService.fetchInjuryReports({ season: request.season, week: request.week, teamIds: [request.teamId] }, context),
    ])

    const matchup = this.resolveMatchup(request, scheduleWeek)
    const opponentDefense = matchup?.opponentTeamId
      ? defenseStats.find((entry) => entry.teamId === matchup.opponentTeamId)
      : undefined

    const weather = await this.resolveWeatherData(matchup, context)

    const factorResults = this.computeFactors({
      request,
      seasonStats,
      prevSeasonStats,
      opponentDefense,
      injuries,
      weather,
      matchup,
    })

    const factors: Record<AnalysisMetric, FactorDetail> = Object.entries(factorResults).reduce(
      (acc, [metric, result]) => {
        acc[metric as AnalysisMetric] = {
          score: roundTo(clamp(result.score)),
          weight: FACTOR_WEIGHTS[metric as AnalysisMetric],
          description: result.description ?? DEFAULT_FACTOR_DESCRIPTION[metric as AnalysisMetric],
          reliability: roundTo(clamp(result.reliability ?? 0.5)),
        }
        return acc
      },
      {} as Record<AnalysisMetric, FactorDetail>,
    )

    const compositeScore = roundTo(
      (Object.keys(FACTOR_WEIGHTS) as AnalysisMetric[]).reduce((sum, metric) => {
        const detail = factors[metric]
        return sum + detail.score * detail.weight
      }, 0),
    )

    const confidence = this.deriveConfidence(factors)
    const recommendation = this.buildRecommendation(compositeScore, confidence, request.position)
    const notes = this.collectNotes(factorResults)

    return {
      playerId: request.playerId,
      season: request.season,
      week: request.week,
      generatedAt: new Date().toISOString(),
      factors,
      compositeScore,
      confidence,
      recommendation,
      notes,
    }
  }

  private computeFactors(inputs: {
    request: PlayerAnalysisRequest
    seasonStats: PlayerStat[]
    prevSeasonStats: PlayerStat[]
    opponentDefense?: TeamDefenseStat
    injuries: InjuryReport[]
    weather: WeatherReport | null
    matchup?: MatchupContext
  }) {
    return {
      historicalPerformance: this.computeHistoricalPerformance(inputs.seasonStats, inputs.prevSeasonStats),
      recentForm: this.computeRecentForm(inputs.seasonStats),
      matchupDifficulty: this.computeMatchupDifficulty(inputs.opponentDefense),
      defensiveSchemeImpact: this.computeDefensiveSchemeImpact(inputs.opponentDefense, inputs.seasonStats),
      coordinatorTendencies: this.computeCoordinatorTendencies(inputs.matchup),
      injuryImpact: this.computeInjuryImpact(inputs.injuries),
      weatherImpact: this.computeWeatherImpact(inputs.weather, inputs.request.position),
    } satisfies Record<AnalysisMetric, FactorComputation>
  }

  private computeHistoricalPerformance(currentSeason: PlayerStat[], previousSeason: PlayerStat[]): FactorComputation {
    const historicalPoints = safeAverage(previousSeason.map((item) => item.points ?? 0))
    const currentAverage = safeAverage(currentSeason.map((item) => item.points ?? 0))
    const blended = safeAverage([historicalPoints, currentAverage])
    const normalized = clamp(blended / MAX_EXPECTED_POINTS)

    const reliability = previousSeason.length ? 0.8 : 0.5
    const description = previousSeason.length
      ? `Averaging ${roundTo(currentAverage, 2)} pts (prev season ${roundTo(historicalPoints, 2)})`
      : `Limited historical sample (${currentSeason.length} games)`

    return {
      score: normalized,
      reliability,
      description,
    }
  }

  private computeRecentForm(currentSeason: PlayerStat[]): FactorComputation {
    if (!currentSeason.length) {
      return { score: 0.4, reliability: 0.2, description: "No recent data" }
    }

    const sorted = [...currentSeason].sort((a, b) => (b.week ?? 0) - (a.week ?? 0))
    const recentSlice = sorted.slice(0, RECENT_WEEKS)
    const recentAvg = safeAverage(recentSlice.map((item) => item.points ?? 0))
    const seasonAvg = safeAverage(currentSeason.map((item) => item.points ?? 0))

    const delta = seasonAvg ? (recentAvg - seasonAvg) / Math.max(seasonAvg, 1) : 0
    const normalized = clamp(0.5 + delta / 2)

    return {
      score: normalized,
      reliability: recentSlice.length >= RECENT_WEEKS ? 0.8 : 0.6,
      description: `Recent avg ${roundTo(recentAvg, 2)} pts vs season ${roundTo(seasonAvg, 2)}`,
    }
  }

  private computeMatchupDifficulty(opponentDefense?: TeamDefenseStat): FactorComputation {
    if (!opponentDefense) {
      return { score: 0.5, reliability: 0.3, description: "Opponent data unavailable" }
    }

    const rankComponent = inverseNormalize(opponentDefense.rank, 1, 32)
    const pointsComponent = inverseNormalize(opponentDefense.pointsAllowed ?? 24, 10, 35)
    const combined = clamp(rankComponent * 0.6 + pointsComponent * 0.4)

    return {
      score: combined,
      reliability: 0.75,
      description: `Opponent rank ${opponentDefense.rank} with ${opponentDefense.pointsAllowed ?? 0} pts allowed per game`,
    }
  }

  private computeDefensiveSchemeImpact(opponentDefense: TeamDefenseStat | undefined, stats: PlayerStat[]): FactorComputation {
    if (!opponentDefense) {
      return { score: 0.5, reliability: 0.3, description: "Scheme intel unavailable" }
    }

    const turnovers = opponentDefense.turnovers ?? 0
    const yardsAllowed = opponentDefense.yardsAllowed ?? 350
    const turnoverPressure = clamp(turnovers / 3)
    const yardsComponent = inverseNormalize(yardsAllowed, 250, 420)
    const positionMultiplier = this.estimatePositionMultiplier(stats[0]?.position)

    const combined = clamp(turnoverPressure * 0.6 + yardsComponent * 0.4) * positionMultiplier

    return {
      score: combined,
      reliability: 0.6,
      description: `Defense forces ${turnovers} turnovers with ${yardsAllowed} yards allowed`,
    }
  }

  private computeCoordinatorTendencies(matchup?: MatchupContext): FactorComputation {
    if (!matchup?.metadata) {
      return {
        score: 0.5,
        reliability: 0.25,
        description: "Coordinator data pending integration",
      }
    }

    const passRate = matchup.metadata.offensivePassRate ?? 0.5
    const redZoneTouches = matchup.metadata.redZoneTouches ?? 0.5
    const normalized = clamp(passRate * 0.6 + redZoneTouches * 0.4)

    return {
      score: normalized,
      reliability: 0.55,
      description: `Coordinator pass rate ${(passRate * 100).toFixed(0)}%, red-zone share ${(redZoneTouches * 100).toFixed(0)}%`,
    }
  }

  private computeInjuryImpact(injuries: InjuryReport[]): FactorComputation {
    if (!injuries.length) {
      return {
        score: 0.85,
        reliability: 0.4,
        description: "No reported injuries",
      }
    }

    const worstStatusScore = Math.min(...injuries.map((report) => INJURY_IMPACT_MAP[report.status] ?? 0.5))

    return {
      score: worstStatusScore,
      reliability: 0.7,
      description: `Worst designation: ${injuries[0]?.status ?? "UNKNOWN"}`,
    }
  }

  private computeWeatherImpact(weather: WeatherReport | null, position?: string): FactorComputation {
    if (!weather) {
      return { score: 0.7, reliability: 0.3, description: "Weather forecast unavailable" }
    }

    const temperatureScore = normalize(weather.temperature ?? 65, 20, 85)
    const windPenalty = clamp((weather.windSpeed ?? 5) / 25)
    const precipitationPenalty = clamp((weather.precipitationChance ?? 0) / 100)

    const passingPositions = new Set(["QB", "WR", "TE"])
    const isPassingPosition = position ? passingPositions.has(position) : true

    const weatherScore = clamp(temperatureScore - (windPenalty + precipitationPenalty) * (isPassingPosition ? 0.6 : 0.3))

    return {
      score: weatherScore,
      reliability: 0.6,
      description: `Temp ${weather.temperature ?? "N/A"}°F, wind ${weather.windSpeed ?? "N/A"} mph, precip ${weather.precipitationChance ?? "N/A"}%`,
    }
  }

  private deriveConfidence(factors: Record<AnalysisMetric, FactorDetail>) {
    const reliabilities = Object.values(factors).map((detail) => detail.reliability)
    const averageReliability = safeAverage(reliabilities)
    const scoreSpread = Math.max(...Object.values(factors).map((f) => f.score)) - Math.min(...Object.values(factors).map((f) => f.score))
    const variancePenalty = clamp(scoreSpread / 2)
    const confidence = clamp(averageReliability - variancePenalty * 0.2)
    return roundTo(confidence)
  }

  private buildRecommendation(score: number, confidence: number, position?: string): PlayerAnalysisBreakdown["recommendation"] {
    const thresholdStart = position === "QB" ? 0.6 : 0.65
    if (score >= thresholdStart && confidence >= 0.55) {
      return "start"
    }
    if (score >= 0.45) {
      return "flex"
    }
    return "bench"
  }

  private collectNotes(results: Record<AnalysisMetric, FactorComputation>) {
    const notes: string[] = []
    Object.entries(results).forEach(([metric, detail]) => {
      if ((detail.reliability ?? 0.5) < 0.4) {
        notes.push(`Limited data for ${FACTOR_LABELS[metric as AnalysisMetric]}`)
      }
      if (detail.note) {
        notes.push(detail.note)
      }
    })

    if (notes.length === 0) {
      const sorted = Object.entries(results).sort(([, a], [, b]) => (b.score ?? 0) - (a.score ?? 0))
      const top = sorted[0]
      const bottom = sorted[sorted.length - 1]

      if (top) {
        const [metric, detail] = top
        const description = detail.description ?? DEFAULT_FACTOR_DESCRIPTION[metric as AnalysisMetric]
        notes.push(`Strength: ${FACTOR_LABELS[metric as AnalysisMetric]} — ${description}`)
      }

      if (bottom && bottom[0] !== top?.[0]) {
        const [metric, detail] = bottom
        const description = detail.description ?? DEFAULT_FACTOR_DESCRIPTION[metric as AnalysisMetric]
        notes.push(`Watch: ${FACTOR_LABELS[metric as AnalysisMetric]} — ${description}`)
      }
    }

    return notes
  }

  private resolveMatchup(request: PlayerAnalysisRequest, schedule: GameSchedule[]): MatchupContext | undefined {
    const game = schedule.find(
      (item) => item.homeTeamId === request.teamId || item.awayTeamId === request.teamId,
    )

    if (!game) {
      return undefined
    }

    const opponentTeamId = game.homeTeamId === request.teamId ? game.awayTeamId : game.homeTeamId

    return {
      gameId: game.gameId,
      opponentTeamId,
      metadata: {
        offensivePassRate: undefined,
        redZoneTouches: undefined,
      },
    }
  }

  private async resolveWeatherData(matchup: MatchupContext | undefined, context: DataFetchContext) {
    try {
      if (!matchup?.gameId) {
        return null
      }
      const reports = await this.dataService.fetchWeatherData({ gameIds: [matchup.gameId] }, context)
      return reports[0] ?? null
    } catch (error) {
      this.logError("weatherFallback", error, { requestId: context.requestId, reason: context.reason })
      return null
    }
  }

  private estimatePositionMultiplier(position?: string) {
    if (!position) {
      return 1
    }
    switch (position) {
      case "QB":
        return 1
      case "RB":
        return 0.95
      case "WR":
        return 0.9
      case "TE":
        return 0.85
      default:
        return 0.8
    }
  }

  private logError(scope: string, error: unknown, context: { requestId: string; reason?: string }) {
    const nfError = error instanceof NFLDataError ? error : toNFLDataError(error, scope)
    if (process.env.NODE_ENV !== "test") {
      console.error(
        `[PlayerAnalysis:${scope}]`,
        nfError.message,
        {
          code: nfError.code,
          requestId: context.requestId,
          reason: context.reason,
        },
      )
    }
  }
}

interface FactorComputation {
  score: number
  reliability?: number
  description?: string
  note?: string
}

interface MatchupMetadata {
  offensivePassRate?: number
  redZoneTouches?: number
}

interface MatchupContext {
  gameId: string
  opponentTeamId: string
  metadata?: MatchupMetadata
}

export const playerAnalysisEngine = new PlayerAnalysisEngine()
