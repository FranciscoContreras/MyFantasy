export interface FetchPlayerStatsParams {
  season: number
  week?: number
  playerIds?: string[]
}

export interface FetchTeamDefenseParams {
  season: number
  week?: number
}

export interface FetchScheduleParams {
  season: number
  week?: number
}

export interface FetchInjuryReportParams {
  season: number
  week?: number
  teamIds?: string[]
}

export interface FetchWeatherParams {
  gameIds: string[]
}

export interface PlayerStat {
  playerId: string
  name: string
  team: string
  position: string
  season: number
  week?: number
  points: number
  stats: Record<string, number | string | null>
  source: string
}

export interface TeamDefenseStat {
  teamId: string
  season: number
  week?: number
  rank: number
  pointsAllowed: number
  yardsAllowed: number
  turnovers: number
  source: string
}

export interface GameSchedule {
  gameId: string
  season: number
  week: number
  startTime: string
  stadium: string
  homeTeamId: string
  awayTeamId: string
  network?: string
  status?: string
  statusDetail?: string
  completed?: boolean
  odds?: {
    spread?: number
    total?: number
    favoriteTeamId?: string
  }
}

export interface InjuryReport {
  playerId: string
  teamId: string
  status: string
  designation?: string
  description?: string
  updatedAt: string
  source: string
}

export interface WeatherReport {
  gameId: string
  temperature?: number
  precipitationChance?: number
  windSpeed?: number
  condition?: string
  updatedAt: string
  source: string
}

export interface HistoricalSyncResult {
  gamesSynced: number
  playersUpdated: number
  windowStart: string
  windowEnd: string
}

export interface HistoricalSyncOptions {
  season: number
  startWeek?: number
  endWeek?: number
  context?: DataFetchContext
}

export interface DataFetchContext {
  requestId: string
  reason?: string
  ttlMs?: number
}
