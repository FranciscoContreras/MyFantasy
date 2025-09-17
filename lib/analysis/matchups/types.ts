import type { AnalysisFactors } from "@/lib/analysis"

export interface MatchupAnalysisRequest {
  playerId: string
  teamId: string
  opponentTeamId: string
  season: number
  week: number
  position: string
  context?: {
    requestId?: string
    forceRefresh?: boolean
  }
}

export interface MatchupTrend {
  label: string
  direction: "positive" | "negative" | "neutral"
  magnitude: number
  summary: string
}

export interface GameScriptProjection {
  pace: number
  expectedPlays: number
  passRate: number
  neutralPassRate: number
  projectedMargin: number
  notes: string[]
}

export interface MatchupFactorDetail {
  score: number
  impact: number
  summary: string
}

export interface MatchupFactors {
  playerVsDefense: MatchupFactorDetail
  positionStrength: MatchupFactorDetail
  schemeAdvantage: MatchupFactorDetail
  gameScript: MatchupFactorDetail
}

export interface MatchupAnalysisResult {
  playerId: string
  teamId: string
  opponentTeamId: string
  season: number
  week: number
  generatedAt: string
  factors: MatchupFactors
  gameScript: GameScriptProjection
  trends: MatchupTrend[]
  overallScore: number
  volatility: number
  recommendedAdjustments: string[]
}

export interface HistoricalMatchupSample {
  season: number
  week: number
  points: number
  snapShare?: number
}

export interface PositionalDefenseMetric {
  teamId: string
  position: string
  rank: number
  pointsAllowed: number
  receptionsAllowed?: number
  yardsAllowed?: number
  explosiveRate?: number
}

export interface SchemeIntel {
  teamId: string
  blitzRate?: number
  manCoverageRate?: number
  zoneCoverageRate?: number
  pressureRate?: number
  notes?: string
}

export interface GameScriptData {
  teamId: string
  pace?: number
  passRate?: number
  neutralPassRate?: number
  projectedMargin?: number
  playsPerGame?: number
}

export interface MatchupDataSource {
  fetchPlayerMatchupSamples(request: MatchupAnalysisRequest): Promise<HistoricalMatchupSample[]>
  fetchPositionalDefenseMetrics(position: string, season: number, week: number): Promise<PositionalDefenseMetric[]>
  fetchSchemeIntel(teamIds: string[]): Promise<SchemeIntel[]>
  fetchGameScriptData(teamIds: string[], season: number, week: number): Promise<GameScriptData[]>
  fetchAnalysisFactors?(request: MatchupAnalysisRequest): Promise<AnalysisFactors | null>
}

export type FactorDetail = {
  reliability?: number
}
