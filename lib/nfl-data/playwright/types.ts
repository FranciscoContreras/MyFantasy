import type {
  FetchInjuryReportParams,
  FetchPlayerStatsParams,
  FetchScheduleParams,
  FetchTeamDefenseParams,
  FetchWeatherParams,
} from "@/lib/nfl-data/types"

export type PlaywrightCommandName =
  | "scrape-espn-player-stats"
  | "scrape-espn-team-defense"
  | "scrape-espn-schedule"
  | "scrape-espn-injuries"
  | "scrape-nfl-weather"
  | "sync-historical-dataset"

export interface PlaywrightCommandInput {
  name: PlaywrightCommandName
  description: string
  args: Record<string, unknown>
  options?: {
    captureScreenshot?: boolean
    captureHtml?: boolean
    retries?: number
  }
}

export interface PlaywrightCommandContext {
  requestId: string
  correlationId?: string
}

export interface PlaywrightCommandResult<TData = unknown> {
  data: TData
  meta?: {
    screenshotPath?: string
    htmlPath?: string
    durationMs?: number
    commandLog?: string[]
  }
}

export interface ScrapePlayerStatsPayload extends FetchPlayerStatsParams {
  includeAdvancedMetrics?: boolean
}

export type ScrapeTeamDefensePayload = FetchTeamDefenseParams

export interface ScrapeSchedulePayload extends FetchScheduleParams {
  includeWeather?: boolean
}

export interface ScrapeInjuryPayload extends FetchInjuryReportParams {
  includePracticeNotes?: boolean
}

export type ScrapeWeatherPayload = FetchWeatherParams & {
  includeRadar?: boolean
}
