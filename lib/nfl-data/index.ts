import { NFLDataError, toNFLDataError } from "@/lib/nfl-data/errors"
import { nflDataCache } from "@/lib/nfl-data/cache"
import { ESPNClient } from "@/lib/nfl-data/providers/espn"
import { WeatherClient } from "@/lib/nfl-data/providers/weather"
import { PlaywrightScrapingService } from "@/lib/nfl-data/playwright/scraper"
import { cacheGet, cacheKey, cachePut } from "@/lib/nfl-data/cache-strategy"
import type {
  DataFetchContext,
  FetchInjuryReportParams,
  FetchPlayerStatsParams,
  FetchScheduleParams,
  FetchTeamDefenseParams,
  FetchWeatherParams,
  HistoricalSyncOptions,
  HistoricalSyncResult,
  InjuryReport,
  PlayerStat,
  TeamDefenseStat,
  GameSchedule,
  WeatherReport,
} from "@/lib/nfl-data/types"

interface NFLDataServiceOptions {
  espnClient?: ESPNClient
  weatherClient?: WeatherClient
  scraper?: PlaywrightScrapingService
}

export class NFLDataService {
  private readonly espn: ESPNClient
  private readonly weather: WeatherClient
  private readonly scraper?: PlaywrightScrapingService

  constructor(options: NFLDataServiceOptions = {}) {
    this.espn = options.espnClient ?? new ESPNClient()
    this.weather = options.weatherClient ?? new WeatherClient()
    this.scraper = options.scraper
  }

  async fetchPlayerStats(
    params: FetchPlayerStatsParams,
    context: DataFetchContext = { requestId: "player-stats" },
  ): Promise<PlayerStat[]> {
    const key = cacheKey([
      "player-stats",
      params.season,
      params.week,
      params.playerIds ? [...params.playerIds].sort().join(",") : undefined,
    ])

    return this.withCaching(key, context, async () => {
      try {
        return await this.espn.getPlayerStats(params)
      } catch (error) {
        this.logError("fetchPlayerStats", error, context)
        const fallback = this.scraper ? await this.scraper.scrapePlayerStats({ ...params }, { context }) : null
        return fallback ?? []
      }
    })
  }

  async fetchTeamDefense(
    params: FetchTeamDefenseParams,
    context: DataFetchContext = { requestId: "team-defense" },
  ): Promise<TeamDefenseStat[]> {
    const key = cacheKey(["team-defense", params.season, params.week])

    return this.withCaching(key, context, async () => {
      try {
        return await this.espn.getTeamDefense(params)
      } catch (error) {
        this.logError("fetchTeamDefense", error, context)
        const fallback = this.scraper ? await this.scraper.scrapeTeamDefense({ ...params }, { context }) : null
        return fallback ?? []
      }
    })
  }

  async fetchSchedule(
    params: FetchScheduleParams,
    context: DataFetchContext = { requestId: "schedule" },
  ): Promise<GameSchedule[]> {
    const key = cacheKey(["schedule", params.season, params.week])

    return this.withCaching(key, context, async () => {
      try {
        return await this.espn.getSchedule(params)
      } catch (error) {
        this.logError("fetchSchedule", error, context)
        const fallback = this.scraper ? await this.scraper.scrapeSchedule({ ...params }, { context }) : null
        return fallback ?? []
      }
    })
  }

  async fetchInjuryReports(
    params: FetchInjuryReportParams,
    context: DataFetchContext = { requestId: "injuries" },
  ): Promise<InjuryReport[]> {
    const key = cacheKey([
      "injuries",
      params.season,
      params.week,
      params.teamIds ? [...params.teamIds].sort().join(",") : undefined,
    ])

    return this.withCaching(key, context, async () => {
      try {
        return await this.espn.getInjuryReports(params)
      } catch (error) {
        this.logError("fetchInjuryReports", error, context)
        const fallback = this.scraper ? await this.scraper.scrapeInjuries({ ...params }, { context }) : null
        return fallback ?? []
      }
    })
  }

  async fetchWeatherData(
    params: FetchWeatherParams,
    context: DataFetchContext = { requestId: "weather" },
  ): Promise<WeatherReport[]> {
    if (!params.gameIds.length) {
      return []
    }

    const key = cacheKey(["weather", [...params.gameIds].sort().join(",")])

    return this.withCaching(key, context, async () => {
      try {
        return await this.weather.getWeather(params)
      } catch (error) {
        this.logError("fetchWeatherData", error, context)
        const fallback = this.scraper ? await this.scraper.scrapeWeather({ ...params }, { context }) : null
        return fallback ?? []
      }
    })
  }

  async syncHistoricalData(options: HistoricalSyncOptions): Promise<HistoricalSyncResult> {
    const { season, startWeek = 1, endWeek = 18, context = { requestId: "historical" } } = options

    try {
      const stats = await this.fetchPlayerStats({ season }, context)
      const schedule = await this.fetchSchedule({ season }, context)

      return {
        gamesSynced: schedule.length,
        playersUpdated: stats.length,
        windowStart: `season:${season}:week:${startWeek}`,
        windowEnd: `season:${season}:week:${endWeek}`,
      }
    } catch (error) {
      throw toNFLDataError(error, "Failed to sync historical data")
    }
  }

  private async withCaching<T>(
    cacheKeyString: string,
    context: DataFetchContext,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const refresh = context.reason?.includes("refresh") ?? false

    if (!refresh) {
      const memoryHit = nflDataCache.get(cacheKeyString) as T | null
      if (memoryHit !== null && memoryHit !== undefined) {
        return memoryHit
      }

      try {
        const redisHit = await cacheGet<T>(cacheKeyString)
        if (redisHit !== null && redisHit !== undefined) {
          if (context.ttlMs !== 0) {
            nflDataCache.set(cacheKeyString, redisHit, context.ttlMs)
          }
          return redisHit
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "test") {
          console.warn(`[NFLDataService:cache] redis lookup failed`, {
            cacheKey: cacheKeyString,
            error,
          })
        }
      }
    }

    const result = await fetcher()
    if (context.ttlMs !== 0) {
      try {
        nflDataCache.set(cacheKeyString, result, context.ttlMs)
        await cachePut(cacheKeyString, result, {
          ttlSeconds: context.ttlMs ? Math.max(1, Math.round(context.ttlMs / 1000)) : undefined,
        })
      } catch (error) {
        if (process.env.NODE_ENV !== "test") {
          console.warn(`[NFLDataService:cache] redis write failed`, {
            cacheKey: cacheKeyString,
            error,
          })
        }
      }
    }
    return result
  }

  private logError(scope: string, error: unknown, context: DataFetchContext) {
    const nfError = error instanceof NFLDataError ? error : toNFLDataError(error, scope)
    if (process.env.NODE_ENV !== "test") {
      console.error(
        `[NFLDataService:${scope}]`,
        nfError.message,
        {
          code: nfError.code,
          requestId: context.requestId,
          reason: context.reason,
          meta: nfError.meta,
        },
      )
    }
  }
}

export const nflDataService = new NFLDataService()
