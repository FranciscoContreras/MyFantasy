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
  pointsFor?: number
  pointsAgainst?: number
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
  standings: EspnStandingEntry[]
  raw?: Record<string, unknown>
}

export interface EspnStandingEntry {
  teamId: string
  wins: number
  losses: number
  ties: number
  winPct: number
  pointsFor?: number
  streak?: string
}

export interface EspnLeagueApiResponse {
  id: number
  seasonId: number
  scoringPeriodId: number
  status?: {
    currentMatchupPeriod?: number
  }
  settings?: {
    name?: string
    scoringSettings?: {
      matchupTieRule?: number
      scoringItems?: EspnScoringItemApi[]
    }
    draftSettings?: {
      type?: string
    }
    rosterSettings?: {
      lineupSlots?: EspnRosterSlotApi[]
      lineupSlotCounts?: Array<unknown>
    }
    scheduleSettings?: {
      playoffMatchupPeriodIds?: number[]
    }
    tradeSettings?: {
      deadlineDate?: string
    }
    acquisitionSettings?: {
      faabBudget?: number
    }
  }
  teams?: EspnTeamApi[]
  transactions?: EspnTransactionApi[]
}

export interface EspnTeamApi {
  id?: number
  nickname?: string
  location?: string
  abbrev?: string
  owners?: string[]
  logo?: string
  playoffSeed?: number
  record?: {
    overall?: {
      wins?: number
      losses?: number
      ties?: number
    }
  }
  roster?: {
    entries?: EspnRosterEntryApi[]
  }
}

export interface EspnRosterEntryApi {
  playerId?: number
  lineupSlotId?: string
  playerPoolEntry?: {
    player?: {
      fullName?: string
      defaultPositionId?: string
      proTeamAbbreviation?: string
      injuryStatus?: string
      acquisitionType?: string
      stats?: Array<{ appliedTotal?: number }>
      ownership?: {
        percentOwned?: number
      }
    }
    appliedStatTotal?: number
  }
}

export interface EspnScoringItemApi {
  statId?: number
  statName?: string
  points?: number
}

export interface EspnRosterSlotApi {
  slotCategoryId?: string
  count?: number
}

export interface EspnTransactionApi {
  id?: number
  type?: string
  processDate?: number
  messages?: Array<{ text?: string }>
  teams?: Array<{ teamId?: number }>
}
