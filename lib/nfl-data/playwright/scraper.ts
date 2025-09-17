import { NFLDataError } from "@/lib/nfl-data/errors"
import type {
  InjuryReport,
  PlayerStat,
  GameSchedule,
  TeamDefenseStat,
  WeatherReport,
} from "@/lib/nfl-data/types"

import type {
  PlaywrightCommandContext,
  PlaywrightCommandResult,
  ScrapeInjuryPayload,
  ScrapePlayerStatsPayload,
  ScrapeSchedulePayload,
  ScrapeTeamDefensePayload,
  ScrapeWeatherPayload,
  PlaywrightCommandInput,
  PlaywrightCommandName,
} from "./types"
import { PlaywrightMCPClient } from "./client"

interface ScrapeOptions {
  context?: Partial<PlaywrightCommandContext>
}

const defaultContext: PlaywrightCommandContext = {
  requestId: "playwright-scraper",
}

export class PlaywrightScrapingService {
  constructor(private readonly client = new PlaywrightMCPClient()) {}

  async scrapePlayerStats(
    payload: ScrapePlayerStatsPayload,
    options: ScrapeOptions = {},
  ): Promise<PlayerStat[]> {
    const command = this.buildCommand(
      "scrape-espn-player-stats",
      "Navigate to ESPN NFL stats page and extract player data",
      this.toCommandArgs(payload),
    )
    const result = await this.runCommand<ScrapePlayerStatsResult>(command, options)
    return this.normalizePlayers(result?.data?.players)
  }

  async scrapeTeamDefense(
    payload: ScrapeTeamDefensePayload,
    options: ScrapeOptions = {},
  ): Promise<TeamDefenseStat[]> {
    const command = this.buildCommand(
      "scrape-espn-team-defense",
      "Scrape defensive coordinator information from Pro Football Reference",
      this.toCommandArgs(payload),
    )
    const result = await this.runCommand<ScrapeTeamDefenseResult>(command, options)
    return this.normalizeTeamDefense(result?.data?.teams)
  }

  async scrapeSchedule(
    payload: ScrapeSchedulePayload,
    options: ScrapeOptions = {},
  ): Promise<GameSchedule[]> {
    const command = this.buildCommand(
      "scrape-espn-schedule",
      "Navigate to ESPN NFL schedule and extract upcoming games",
      this.toCommandArgs(payload),
    )
    const result = await this.runCommand<ScrapeScheduleResult>(command, options)
    return this.normalizeSchedule(result?.data?.games)
  }

  async scrapeInjuries(
    payload: ScrapeInjuryPayload,
    options: ScrapeOptions = {},
  ): Promise<InjuryReport[]> {
    const command = this.buildCommand(
      "scrape-espn-injuries",
      "Extract injury reports from ESPN and NFL.com",
      this.toCommandArgs(payload),
    )
    const result = await this.runCommand<ScrapeInjuriesResult>(command, options)
    return this.normalizeInjuries(result?.data?.injuries)
  }

  async scrapeWeather(
    payload: ScrapeWeatherPayload,
    options: ScrapeOptions = {},
  ): Promise<WeatherReport[]> {
    const command = this.buildCommand(
      "scrape-nfl-weather",
      "Extract weather data from NFL.com game pages",
      this.toCommandArgs(payload),
    )
    const result = await this.runCommand<ScrapeWeatherResult>(command, options)
    return this.normalizeWeather(result?.data?.weather)
  }

  private buildCommand(name: PlaywrightCommandName, description: string, args: Record<string, unknown>): PlaywrightCommandInput {
    return {
      name,
      description,
      args,
      options: {
        captureScreenshot: true,
        captureHtml: false,
        retries: 2,
      },
    } as const
  }

  private toCommandArgs(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== "object") {
      return {}
    }
    return { ...(payload as Record<string, unknown>) }
  }

  private async runCommand<T extends PlaywrightCommandResult<unknown>>(
    command: PlaywrightCommandInput,
    options: ScrapeOptions,
  ): Promise<T> {
    const context: PlaywrightCommandContext = {
      ...defaultContext,
      ...options.context,
    }

    const result = await this.client.run<T>(command, context).catch((error) => {
      throw new NFLDataError("Playwright command failed", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: { command, context },
      })
    })

    return result
  }

  private normalizePlayers(data: unknown): PlayerStat[] {
    if (!Array.isArray(data)) {
      return []
    }

    return data.filter((entry): entry is PlayerStat => this.isPlayerStat(entry))
  }

  private normalizeTeamDefense(data: unknown): TeamDefenseStat[] {
    if (!Array.isArray(data)) {
      return []
    }
    return data.filter((entry): entry is TeamDefenseStat => this.isTeamDefenseStat(entry))
  }

  private normalizeSchedule(data: unknown): GameSchedule[] {
    if (!Array.isArray(data)) {
      return []
    }
    return data.filter((entry): entry is GameSchedule => this.isGameSchedule(entry))
  }

  private normalizeInjuries(data: unknown): InjuryReport[] {
    if (!Array.isArray(data)) {
      return []
    }
    return data.filter((entry): entry is InjuryReport => this.isInjuryReport(entry))
  }

  private normalizeWeather(data: unknown): WeatherReport[] {
    if (!Array.isArray(data)) {
      return []
    }
    return data.filter((entry): entry is WeatherReport => this.isWeatherReport(entry))
  }

  private isPlayerStat(entry: unknown): entry is PlayerStat {
    if (!entry || typeof entry !== "object") {
      return false
    }
    const candidate = entry as Record<string, unknown>
    return typeof candidate.playerId === "string" && typeof candidate.name === "string"
  }

  private isTeamDefenseStat(entry: unknown): entry is TeamDefenseStat {
    if (!entry || typeof entry !== "object") {
      return false
    }
    const candidate = entry as Record<string, unknown>
    return typeof candidate.teamId === "string" && typeof candidate.rank === "number"
  }

  private isGameSchedule(entry: unknown): entry is GameSchedule {
    if (!entry || typeof entry !== "object") {
      return false
    }
    const candidate = entry as Record<string, unknown>
    return (
      typeof candidate.gameId === "string" &&
      typeof candidate.week === "number" &&
      typeof candidate.season === "number"
    )
  }

  private isInjuryReport(entry: unknown): entry is InjuryReport {
    if (!entry || typeof entry !== "object") {
      return false
    }
    const candidate = entry as Record<string, unknown>
    return typeof candidate.playerId === "string" && typeof candidate.status === "string"
  }

  private isWeatherReport(entry: unknown): entry is WeatherReport {
    if (!entry || typeof entry !== "object") {
      return false
    }
    const candidate = entry as Record<string, unknown>
    return typeof candidate.gameId === "string"
  }
}
