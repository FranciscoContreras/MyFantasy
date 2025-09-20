import { buildScoreboardUrl, buildTeamUrl } from "@/lib/nfl-data/endpoints"
import { NFLDataError } from "@/lib/nfl-data/errors"
import { fetchJson } from "@/lib/nfl-data/http"
import type {
  FetchInjuryReportParams,
  FetchPlayerStatsParams,
  FetchScheduleParams,
  FetchTeamDefenseParams,
  InjuryReport,
  PlayerStat,
  TeamDefenseStat,
  GameSchedule,
} from "@/lib/nfl-data/types"

interface ESPNClientOptions {
  timeoutMs?: number
}

const TEAMS_URL = buildTeamUrl()
const PLAYER_STATS_URL = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/athletes"
const NEWS_URL = "http://site.api.espn.com/apis/site/v2/sports/football/nfl/news"

type RawAthleteResponse = {
  athlete?: {
    id?: string | number
    displayName?: string
    fullName?: string
    team?: {
      abbreviation?: string
    }
    position?: {
      abbreviation?: string
      name?: string
    }
  }
  splits?: {
    categories?: Array<{
      stats?: RawAthleteSplitStat[]
    }>
  }
}

type RawAthleteSplitStat = {
  type?: string
  season?: number
  week?: number
  appliedTotal?: number
  opponentAbbreviation?: string
  opponentShortName?: string
  stats?: Record<string, number | string | null | undefined>
}

type RawTeamEntry = {
  team?: {
    id?: string | number
    record?: {
      items?: Array<{
        stats?: Array<{
          name?: string
          value?: number | string
        }>
      }>
    }
    teamLeaders?: {
      defense?: {
        statistics?: Array<{
          name?: string
          value?: number | string
        }>
      }
    }
    standingSummary?: string
  }
}

type RawScoreboardEvent = {
  id?: string
  date?: string
  week?: {
    number?: number | string
  } | number | string
  competitions?: Array<{
    venue?: {
      fullName?: string
    }
    broadcasts?: Array<{
      names?: string[]
    }>
    odds?: Array<{
      details?: string
      overUnder?: number
      favoriteId?: string
    }>
    competitors?: Array<{
      homeAway?: "home" | "away"
      team?: {
        id?: string
      }
    }>
  }>
  status?: {
    type?: {
      completed?: boolean
      detail?: string
      shortDetail?: string
      description?: string
      name?: string
    }
  }
}

type RawNewsArticle = {
  type?: string
  categories?: Array<{
    description?: string
  }>
  headline?: string
  description?: string
  published?: string
  related?: Array<{
    type?: string
    id?: string | number
    teamId?: string | number
  }>
}

export class ESPNClient {
  private readonly timeout: number

  constructor(options: ESPNClientOptions = {}) {
    this.timeout = options.timeoutMs ?? 10_000
  }

  async getPlayerStats(params: FetchPlayerStatsParams): Promise<PlayerStat[]> {
    try {
      const { season, week, playerIds } = params
      if (!playerIds?.length) {
        return []
      }

      const requests = playerIds.map(async (playerId) => {
        const url = `${PLAYER_STATS_URL}/${playerId}`
        const data = await fetchJson<RawAthleteResponse>(url, {
          timeoutMs: this.timeout,
          params: {
            season,
            region: "us",
            lang: "en",
          },
        })

        return this.mapAthleteToPlayerStat(data, season, week)
      })

      const stats = await Promise.all(requests)
      return stats.filter((stat): stat is PlayerStat => Boolean(stat))
    } catch (error) {
      throw new NFLDataError("Failed to fetch player stats", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  async getTeamDefense(params: FetchTeamDefenseParams): Promise<TeamDefenseStat[]> {
    try {
      const data = await fetchJson<{ sports?: Array<{ leagues?: Array<{ teams?: RawTeamEntry[] }> }> }>(TEAMS_URL, {
        timeoutMs: this.timeout,
        params: {
          lang: "en",
          region: "us",
        },
      })

      const teams = (data?.sports?.[0]?.leagues?.[0]?.teams ?? []) as RawTeamEntry[]

      return teams
        .map((entry) => this.mapTeamToDefense(entry?.team, params.season, params.week))
        .filter((stat): stat is TeamDefenseStat => Boolean(stat))
    } catch (error) {
      throw new NFLDataError("Failed to fetch team defense stats", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  async getSchedule(params: FetchScheduleParams): Promise<GameSchedule[]> {
    try {
      const data = await fetchJson<{ events?: RawScoreboardEvent[] }>(
        buildScoreboardUrl({
          season: params.season,
          week: params.week,
        }),
        {
          timeoutMs: this.timeout,
          params: {
            lang: "en",
            region: "us",
          },
        },
      )

      const events = data?.events ?? []
      return events.map((event) => this.mapEventToSchedule(event, params.season))
    } catch (error) {
      throw new NFLDataError("Failed to fetch schedule", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  async getInjuryReports(params: FetchInjuryReportParams): Promise<InjuryReport[]> {
    try {
      const data = await fetchJson<{ articles?: RawNewsArticle[] }>(NEWS_URL, {
        timeoutMs: this.timeout,
        params: {
          lang: "en",
          region: "us",
        },
      })

      const articles = data?.articles ?? []
      return this.mapNewsToInjuries(articles, params)
    } catch (error) {
      throw new NFLDataError("Failed to fetch injury reports", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  private mapAthleteToPlayerStat(data: RawAthleteResponse, season: number, week?: number): PlayerStat | null {
    if (!data) return null

    const athlete = data?.athlete
    if (!athlete) return null

    const stats = data?.splits?.categories?.flatMap((category) => category?.stats ?? []) ?? []
    const latestStat = stats.find(
      (stat) => stat?.type === "week" && stat?.season === season && (!week || stat?.week === week),
    )

    const points = latestStat?.appliedTotal ?? latestStat?.stats?.fantasyPoints ?? null

    return {
      playerId: String(athlete.id),
      name: athlete.displayName ?? athlete.fullName ?? "Unknown Player",
      team: athlete.team?.abbreviation ?? "",
      position: athlete.position?.abbreviation ?? athlete.position?.name ?? "",
      season,
      week: latestStat?.week ?? week,
      points: typeof points === "number" ? points : 0,
      stats: {
        opponent: latestStat?.opponentAbbreviation ?? latestStat?.opponentShortName ?? null,
        targets: latestStat?.stats?.receptions ?? latestStat?.stats?.targets ?? null,
        redZoneTargets: latestStat?.stats?.redZoneTargets ?? null,
        receptions: latestStat?.stats?.receptions ?? null,
        rushingAttempts: latestStat?.stats?.rushingAttempts ?? null,
        fantasyPoints: points,
      },
      source: "espn",
    }
  }

  private mapTeamToDefense(team: RawTeamEntry["team"], season: number, week?: number): TeamDefenseStat | null {
    if (!team) return null

    const record = team.record?.items?.[0]
    const stats = team.teamLeaders?.defense?.statistics ?? []

    return {
      teamId: String(team.id),
      season,
      week,
      rank: team.standingSummary ? Number.parseInt(team.standingSummary, 10) || 0 : 0,
      pointsAllowed: Number(stats.find((stat) => stat?.name === "pointsAgainstTotal")?.value ?? 0),
      yardsAllowed: Number(stats.find((stat) => stat?.name === "yardsAllowedTotal")?.value ?? 0),
      turnovers: Number(record?.stats?.find((stat) => stat?.name === "turnovers")?.value ?? 0),
      source: "espn",
    }
  }

  private mapEventToSchedule(event: RawScoreboardEvent, season: number): GameSchedule {
    const competitions = event?.competitions?.[0] ?? {}
    const competitors = competitions?.competitors ?? []
    const homeTeam = competitors.find((comp) => comp?.homeAway === "home")
    const awayTeam = competitors.find((comp) => comp?.homeAway === "away")
    const oddsEntry = competitions?.odds?.[0]

    const parsedSpread = (() => {
      if (typeof oddsEntry?.details === "number") {
        return oddsEntry.details
      }

      if (typeof oddsEntry?.details === "string" && oddsEntry.details.trim().length > 0) {
        const numeric = Number.parseFloat(oddsEntry.details.replace(/[^0-9+\-\.]+/g, ""))
        return Number.isNaN(numeric) ? undefined : numeric
      }

      return undefined
    })()

    const parsedTotal = (() => {
      if (typeof oddsEntry?.overUnder === "number") {
        return oddsEntry.overUnder
      }

      if (typeof oddsEntry?.overUnder === "string") {
        const numeric = Number.parseFloat(oddsEntry.overUnder)
        return Number.isNaN(numeric) ? undefined : numeric
      }

      return undefined
    })()

    const favoriteTeamId = oddsEntry?.favoriteId != null ? String(oddsEntry.favoriteId) : undefined

    return {
      gameId: event?.id ?? "",
      season,
      week: Number.parseInt(
        String(
          typeof event?.week === "object" ? event.week?.number ?? "" : (event?.week as string | number | undefined) ?? "",
        ),
        10,
      ) || 0,
      startTime: event?.date ?? "",
      stadium: competitions?.venue?.fullName ?? "",
      homeTeamId: homeTeam?.team?.id != null ? String(homeTeam.team.id) : "",
      awayTeamId: awayTeam?.team?.id != null ? String(awayTeam.team.id) : "",
      network: competitions?.broadcasts?.[0]?.names?.[0],
      status: event?.status?.type?.description ?? event?.status?.type?.name,
      statusDetail: event?.status?.type?.detail ?? event?.status?.type?.shortDetail,
      completed: Boolean(event?.status?.type?.completed),
      odds:
        oddsEntry || parsedSpread != null || parsedTotal != null || favoriteTeamId
          ? {
              spread: parsedSpread,
              total: parsedTotal,
              favoriteTeamId,
            }
          : undefined,
    }
  }

  private mapNewsToInjuries(articles: RawNewsArticle[], params: FetchInjuryReportParams): InjuryReport[] {
    const relevantTeams = params.teamIds?.map(String)

    return articles
      .filter((article) => article?.type === "injury")
      .flatMap((article) => {
        const related = article?.related ?? []
        return related
          .filter((item) => item?.type === "athlete")
          .map((item) => ({
            playerId: String(item?.id ?? ""),
            teamId: String(item?.teamId ?? ""),
            status: article?.categories?.[0]?.description ?? "",
            designation: article?.headline ?? undefined,
            description: article?.description,
            updatedAt: article?.published ?? new Date().toISOString(),
            source: "espn",
          }))
      })
      .filter((report: InjuryReport) =>
        relevantTeams ? relevantTeams.includes(report.teamId) : Boolean(report.playerId),
      )
  }
}
