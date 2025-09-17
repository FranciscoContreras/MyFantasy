export interface AnalysisFactors {
  historicalPerformance: number
  matchupDifficulty: number
  defensiveSchemeImpact: number
  coordinatorTendencies: number
  recentForm: number
  injuryImpact: number
  weatherImpact: number
}

export type AnalysisMetric = keyof AnalysisFactors

export interface PlayerAnalysisRequest {
  playerId: string
  season: number
  week: number
  teamId: string
  position?: string
  opponentTeamId?: string
  context?: {
    requestId?: string
    forceRefresh?: boolean
  }
}

export interface FactorDetail {
  score: number
  weight: number
  description: string
  reliability: number
}

export interface PlayerAnalysisBreakdown {
  factors: Record<AnalysisMetric, FactorDetail>
  compositeScore: number
  confidence: number
  recommendation: "start" | "flex" | "bench"
  notes: string[]
}

export interface PlayerAnalysisResult extends PlayerAnalysisBreakdown {
  playerId: string
  season: number
  week: number
  generatedAt: string
}
