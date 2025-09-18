export interface TradePlayer {
  id: string
  name: string
  position: string
  team: string
  age?: number
  injuryRisk?: number // 0-1
  restOfSeasonProjection: number // average projected points per game remaining
  scheduleDifficulty?: number // 0-1 (higher means easier schedule)
  byeWeeksRemaining?: number
}

export interface TradePackage {
  teamId: string
  teamName: string
  manager?: string
  currentRecord?: {
    wins: number
    losses: number
    ties?: number
  }
  playoffProbability?: number // 0-1
  playersSent: TradePlayer[]
  playersReceived: TradePlayer[]
}

export interface TradeAnalyzerInput {
  season: number
  week: number
  totalWeeks: number
  teamA: TradePackage
  teamB: TradePackage
  leagueSettings?: {
    scoringType?: string
    rosterSpots?: Record<string, number>
    keeperLeague?: boolean
  }
}

export interface TradeValueBreakdown {
  total: number
  perGame: number
  floor: number
  ceiling: number
  riskAdjustment: number
  scheduleAdjustment: number
}

export interface TradeImpactSummary {
  projectedRecordDelta: number
  playoffProbabilityDelta: number
  weeklyPointDelta: number
  rosterBalanceNotes: string[]
}

export interface TradeFairness {
  score: number // 0-100
  verdict: "fair" | "tilted-team-a" | "tilted-team-b"
  reasoning: string
}

export interface TradeRecommendation {
  accept: boolean
  confidence: number
  summary: string
  keyFactors: string[]
}

export interface TradeAnalysisResult {
  season: number
  week: number
  teamA: {
    outgoing: TradeValueBreakdown
    incoming: TradeValueBreakdown
    net: number
    impact: TradeImpactSummary
  }
  teamB: {
    outgoing: TradeValueBreakdown
    incoming: TradeValueBreakdown
    net: number
    impact: TradeImpactSummary
  }
  fairness: TradeFairness
  recommendation: TradeRecommendation
  generatedAt: string
}
