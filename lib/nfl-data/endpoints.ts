import { buildQuery, buildScoreboardDateRange, getCurrentSeason, type QueryParams } from "@/lib/nfl-data/utils"

const PROTOCOL = "https://"
const SITE_BASE = `${PROTOCOL}site.api.espn.com/apis/site/v2/sports/football/nfl`
const WEB_BASE = `${PROTOCOL}site.web.api.espn.com/apis/common/v3/sports/football/nfl`
const CORE_BASE = `${PROTOCOL}sports.core.api.espn.com/v2/sports/football/leagues/nfl`

export const ESPN_BASE = {
  site: SITE_BASE,
  web: WEB_BASE,
  core: CORE_BASE,
}

export type ScoreboardDateArg = {
  season?: number
  start?: string
  end?: string
  limit?: number
  week?: number
}

export function buildScoreboardUrl({ season, start, end, limit = 400, week }: ScoreboardDateArg = {}): string {
  const params: QueryParams = { limit }

  if (typeof week === "number") {
    params.week = week
  }

  if (start && end) {
    params.dates = `${start}-${end}`
  } else if (season) {
    params.dates = buildScoreboardDateRange(season)
  }

  return `${SITE_BASE}/scoreboard${buildQuery(params)}`
}

export function buildSummaryUrl(gameId: string | number): string {
  return `${SITE_BASE}/summary?event=${gameId}`
}

export function buildTeamUrl(teamId?: string | number, params?: QueryParams): string {
  const path = teamId ? `/teams/${teamId}` : "/teams"
  return `${SITE_BASE}${path}${buildQuery(params)}`
}

export function buildTeamScheduleUrl(teamId: string | number): string {
  return `${SITE_BASE}/teams/${teamId}/schedule`
}

export function buildTeamRosterUrl(teamId: string | number): string {
  return `${SITE_BASE}/teams/${teamId}/roster`
}

export function buildAthleteUrl(athleteId: string | number, segment: "" | "bio" | "overview" | "gamelog" | "stats" | "splits" = "", params?: QueryParams): string {
  const suffix = segment ? `/${segment}` : ""
  return `${WEB_BASE}/athletes/${athleteId}${suffix}${buildQuery(params)}`
}

export function buildAthleteCoreUrl(athleteId: string | number, segment?: string): string {
  const suffix = segment ? `/${segment}` : ""
  return `${CORE_BASE}/athletes/${athleteId}${suffix}`
}

export function buildAthleteSeasonUrl(athleteId: string | number, season: number = getCurrentSeason(), segment: string = "statistics"): string {
  return `${CORE_BASE}/seasons/${season}/types/2/athletes/${athleteId}/${segment}`
}

export function buildAthleteProjectionUrl(athleteId: string | number, season: number = getCurrentSeason()): string {
  return `${CORE_BASE}/seasons/${season}/types/2/athletes/${athleteId}/projections`
}

export function buildGameCoreUrl(gameId: string | number, endpoint: string): string {
  return `${CORE_BASE}/events/${gameId}/competitions/${gameId}/${endpoint}`
}

export function buildGameOddsUrl(gameId: string | number): string {
  return buildGameCoreUrl(gameId, "odds")
}

export function buildGameHeadToHeadUrl(gameId: string | number): string {
  return buildGameCoreUrl(gameId, "odds/1002/head-to-heads")
}

export function buildGameProbabilitiesUrl(gameId: string | number): string {
  return buildGameCoreUrl(gameId, "probabilities") + "?limit=500"
}

export function buildGamePlaysUrl(gameId: string | number): string {
  return buildGameCoreUrl(gameId, "plays") + "?limit=500"
}

export function buildGamePredictorUrl(gameId: string | number): string {
  return buildGameCoreUrl(gameId, "predictor")
}

export function buildGameRosterUrl(gameId: string | number, teamId: string | number): string {
  return `${CORE_BASE}/events/${gameId}/competitions/${gameId}/competitors/${teamId}/roster`
}

export function buildTeamSeasonStatUrl(teamId: string | number, season: number = getCurrentSeason(), segment: string = "statistics"): string {
  return `${CORE_BASE}/seasons/${season}/types/2/teams/${teamId}/${segment}`
}

export const ESPNEndpoints = {
  scoreboard: buildScoreboardUrl,
  summary: buildSummaryUrl,
  team: buildTeamUrl,
  teamSchedule: buildTeamScheduleUrl,
  teamRoster: buildTeamRosterUrl,
  athlete: buildAthleteUrl,
  athleteCore: buildAthleteCoreUrl,
  athleteSeason: buildAthleteSeasonUrl,
  athleteProjection: buildAthleteProjectionUrl,
  gameCore: buildGameCoreUrl,
  gameOdds: buildGameOddsUrl,
  gameHeadToHead: buildGameHeadToHeadUrl,
  gameProbabilities: buildGameProbabilitiesUrl,
  gamePlays: buildGamePlaysUrl,
  gamePredictor: buildGamePredictorUrl,
  gameRoster: buildGameRosterUrl,
  teamSeasonStat: buildTeamSeasonStatUrl,
}
