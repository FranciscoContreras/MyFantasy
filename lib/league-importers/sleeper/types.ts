export interface SleeperLeagueInfo {
  id: string
  name: string
  season: number
  sport: string
  seasonType: string
  scoringType: string
  avatarUrl?: string
  status: "drafting" | "in_progress" | "complete"
}

export interface SleeperUserSummary {
  userId: string
  displayName: string
  avatarUrl?: string
}

export interface SleeperRosterEntry {
  rosterId: number
  ownerId: string
  starters: string[]
  reserves: string[]
  taxi: string[]
  players: string[]
}

export interface SleeperPlayerMetadata {
  playerId: string
  fullName: string
  position: string
  team: string
  age?: number
  status?: string
}

export interface SleeperScoringRule {
  stat: string
  value: number
  description?: string
}

export interface SleeperLeagueSettings {
  rosterPositions: string[]
  benchCount: number
  taxiCount: number
  scoringRules: SleeperScoringRule[]
}

export interface SleeperTransactionEntry {
  id: string
  type: string
  status: string
  executedAt: string
  adds: Record<string, string>
  drops: Record<string, string>
}

export interface SleeperChatMessage {
  id: string
  authorId: string
  authorName: string
  message: string
  createdAt: string
}

export interface SleeperLeagueImportResult {
  fetchedAt: string
  league: SleeperLeagueInfo
  users: SleeperUserSummary[]
  rosters: SleeperRosterEntry[]
  players: SleeperPlayerMetadata[]
  settings: SleeperLeagueSettings
  transactions: SleeperTransactionEntry[]
  chat: SleeperChatMessage[]
  screenshots: string[]
  raw?: Record<string, unknown>
}
