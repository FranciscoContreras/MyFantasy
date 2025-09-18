export interface YahooLeagueInfo {
  id: string
  name: string
  season: number
  sport: string
  scoringType: "head" | "points" | "roto"
  currentWeek: number
  totalWeeks: number
  url: string
}

export interface YahooTeamInfo {
  id: string
  name: string
  manager: {
    nickname: string
    email?: string
    guid?: string
  }
  logoUrl?: string
  record?: {
    wins: number
    losses: number
    ties: number
    winPct?: number
  }
  pointsFor?: number
  pointsAgainst?: number
  streak?: string
}

export interface YahooPlayerEntry {
  id: string
  fullName: string
  position: string
  team: string
  status?: string
  rosterSlot: string
  projectedPoints?: number
  actualPoints?: number
}

export interface YahooRosterSnapshot {
  teamId: string
  players: YahooPlayerEntry[]
}

export interface YahooScoringRule {
  category: string
  value: number
  description?: string
}

export interface YahooScoringSettings {
  rosterSlots: Array<{ slot: string; count: number }>
  scoringRules: YahooScoringRule[]
}

export interface YahooTransactionEntry {
  id: string
  type: "add" | "drop" | "trade" | "waiver" | "commissioner" | "other"
  executedAt: string
  summary: string
  teamsInvolved: string[]
}

export interface YahooLiveScoreEntry {
  teamId: string
  opponentTeamId: string
  teamPoints: number
  opponentPoints: number
  matchupStatus: string
  updatedAt: string
}

export interface YahooLeagueImportResult {
  fetchedAt: string
  league: YahooLeagueInfo
  teams: YahooTeamInfo[]
  rosters: YahooRosterSnapshot[]
  scoring: YahooScoringSettings
  transactions: YahooTransactionEntry[]
  liveScores: YahooLiveScoreEntry[]
  raw?: Record<string, unknown>
}

export interface YahooLeagueSummary {
  league: YahooLeagueInfo
  teams: YahooTeamInfo[]
  link: string
}

export interface YahooMultiLeagueResult {
  fetchedAt: string
  leagues: YahooLeagueSummary[]
}
