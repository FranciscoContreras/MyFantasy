export interface EspnLeagueInfo {
  id: string
  name: string
  season: number
  scoringPeriodId: number
  currentMatchupPeriod: number
  scoringType: "H2H" | "Roto" | "Points"
  draftType: string
  playoffSeedings?: Array<{ seed: number; teamId: string }>
}

export interface EspnTeamInfo {
  id: string
  name: string
  abbreviation: string
  owner: {
    displayName: string
    userId?: string
  }
  logoUrl?: string
  record?: {
    wins: number
    losses: number
    ties: number
  }
  projectedRank?: number
}

export interface EspnPlayerEntry {
  id: string
  fullName: string
  position: string
  proTeam: string
  lineupSlot: string
  injuryStatus?: string
  obtainedVia?: string
  projectedPoints?: number
  actualPoints?: number
  percentOwned?: number
}

export interface EspnRosterSnapshot {
  teamId: string
  players: EspnPlayerEntry[]
}

export interface EspnScoringSettings {
  categories: Array<{
    categoryId: number
    statName: string
    points: number
  }>
  rosterSlots: Array<{
    slot: string
    count: number
  }>
  acquisitionLimits?: {
    tradeDeadline?: string
    totalMoves?: number
    faabBudget?: number
  }
}

export interface EspnTransactionEntry {
  id: string
  type: "Add" | "Drop" | "Trade" | "Waiver" | "Other"
  executedAt: string
  details: string
  teamsInvolved: string[]
}

export interface EspnLeagueImportResult {
  fetchedAt: string
  league: EspnLeagueInfo
  teams: EspnTeamInfo[]
  rosters: EspnRosterSnapshot[]
  scoring: EspnScoringSettings
  transactions: EspnTransactionEntry[]
  raw?: Record<string, unknown>
}
