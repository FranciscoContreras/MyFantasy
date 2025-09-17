import { NFLDataError, toNFLDataError } from "@/lib/nfl-data/errors"
import { nflDataCache } from "@/lib/nfl-data/cache"
import { ESPNClient } from "@/lib/nfl-data/providers/espn"
import { WeatherClient } from "@/lib/nfl-data/providers/weather"
import { PlaywrightScrapingService } from "@/lib/nfl-data/playwright/scraper"
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
    return this.withCaching(`player-stats:${JSON.stringify(params)}`, context, async () => {
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
    return this.withCaching(`team-defense:${JSON.stringify(params)}`, context, async () => {
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
    return this.withCaching(`schedule:${JSON.stringify(params)}`, context, async () => {
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
    return this.withCaching(`injuries:${JSON.stringify(params)}`, context, async () => {
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

    return this.withCaching(`weather:${params.gameIds.sort().join(",")}`, context, async () => {
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
    cacheKey: string,
    context: DataFetchContext,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = nflDataCache.get(cacheKey) as T | null
    if (cached && !context.reason?.includes("refresh")) {
      return cached
    }

    const result = await fetcher()
    if (context.ttlMs !== 0) {
      nflDataCache.set(cacheKey, result, context.ttlMs)
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
