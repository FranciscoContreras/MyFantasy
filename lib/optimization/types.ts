import type { AnalysisFactors, PlayerAnalysisResult, PredictionOutput } from "@/lib/analysis"

export interface PlayerProjection {
  playerId: string
  name: string
  teamId: string
  position: string
  salary?: number
  mean: number
  floor: number
  ceiling: number
  confidence: number // 0-100
  analysisFactors?: AnalysisFactors
  matchupScore?: number
  prediction?: PredictionOutput
}

export interface LineupSlot {
  id: string
  allowedPositions: string[]
  flex?: boolean
}

export interface StackConstraint {
  teamId: string
  minPlayers: number
  maxPlayers?: number
}

export interface LineupConstraints {
  slots: LineupSlot[]
  salaryCap?: number
  maxPerTeam?: number
  minTeams?: number
  stackConstraints?: StackConstraint[]
  includeDefense?: boolean
  allowDuplicatePositions?: boolean
}

export interface OptimizerOptions {
  maxLineups?: number
  maxCandidatesPerSlot?: number
  riskTolerance?: number // 0 (floor heavy) to 1 (ceiling heavy)
  allowDuplicatePlayersAcrossLineups?: boolean
  minFloor?: number
  minMean?: number
  playerExposure?: Record<string, number> // max number of lineups for each player
}

export interface LineupPlayer {
  slotId: string
  playerId: string
  name: string
  teamId: string
  position: string
  mean: number
  floor: number
  ceiling: number
  confidence: number
  salary?: number
}

export interface LineupEvaluation {
  totalMean: number
  totalFloor: number
  totalCeiling: number
  confidence: number
  salary?: number
  teams: Record<string, number>
}

export interface LineupResult {
  id: string
  players: LineupPlayer[]
  evaluation: LineupEvaluation
  score: number
  variance: number
  rank: number
  notes: string[]
}

export interface OptimizerInput {
  players: PlayerProjection[]
  constraints: LineupConstraints
  options?: OptimizerOptions
}

export interface OptimizationContext {
  getPrediction?: (playerId: string) => Promise<PredictionOutput | null>
  getAnalysis?: (playerId: string) => Promise<PlayerAnalysisResult | null>
}
