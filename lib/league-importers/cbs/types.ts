export interface CbsLeagueInfo {
  id: string
  name: string
  season: number
  sport: string
  scoringType: string
  commissioner?: string
  url: string
}

export interface CbsTeamInfo {
  id: string
  name: string
  manager: string
  division?: string
  record?: {
    wins: number
    losses: number
    ties: number
  }
  pointsFor?: number
  pointsAgainst?: number
}

export interface CbsPlayerEntry {
  id: string
  fullName: string
  position: string
  team: string
  status?: string
  rosterSlot: string
  projectedPoints?: number
  actualPoints?: number
  latestNote?: string
}

export interface CbsRosterSnapshot {
  teamId: string
  players: CbsPlayerEntry[]
}

export interface CbsScoringRule {
  category: string
  value: number
  description?: string
}

export interface CbsScoringSettings {
  rosterSlots: Array<{ slot: string; count: number }>
  scoringRules: CbsScoringRule[]
}

export interface CbsPlayerNote {
  playerId: string
  title: string
  content: string
  timestamp: string
  source?: string
}

export interface CbsLeagueImportResult {
  fetchedAt: string
  league: CbsLeagueInfo
  teams: CbsTeamInfo[]
  rosters: CbsRosterSnapshot[]
  scoring: CbsScoringSettings
  playerNotes: CbsPlayerNote[]
  screenshots: string[]
  raw?: Record<string, unknown>
}
