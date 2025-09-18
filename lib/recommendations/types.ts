import type { AnalysisFactors, PlayerAnalysisResult } from "@/lib/analysis"
import type { MatchupAnalysisResult } from "@/lib/analysis/matchups"

export type LineupSlot = "starter" | "bench"

export interface StartSitHistoryEntry {
  week: number
  recommendation: "start" | "sit"
  success: boolean
  actualPoints: number
  opponent?: string
}

export interface StartSitPlayerInput {
  id: string
  name: string
  position: string
  team: string
  opponent: string
  season: number
  week: number
  baselineProjection: number
  lineupSlot: LineupSlot
  factors?: AnalysisFactors
  analysis?: PlayerAnalysisResult
  matchup?: MatchupAnalysisResult
  history?: StartSitHistoryEntry[]
}

export interface StartSitRequest {
  season: number
  week: number
  roster: StartSitPlayerInput[]
  confidenceThreshold?: number
  deltaThreshold?: number
  maxRecommendations?: number
}

export interface StartSitAlternative {
  id: string
  name: string
  position: string
  team: string
  projectedPoints: number
  confidence: number
  delta: number
}

export interface StartSitHistorySummary {
  successRate: number
  sampleSize: number
  lastFive: Array<{ week: number; success: boolean }>
}

export interface StartSitRecommendation {
  id: string
  type: "start" | "sit"
  player: {
    id: string
    name: string
    position: string
    team: string
    opponent: string
  }
  projectedPoints: number
  baseline: number
  delta: number
  confidence: number
  reasoning: string
  insight: string
  alternatives: StartSitAlternative[]
  history: StartSitHistorySummary
  generatedAt: string
}

export interface StartSitRecommendationResult {
  season: number
  week: number
  recommendations: StartSitRecommendation[]
  generatedAt: string
}
