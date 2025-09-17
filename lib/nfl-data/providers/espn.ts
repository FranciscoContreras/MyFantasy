import axios, { type AxiosInstance } from "axios"

import { NFLDataError } from "@/lib/nfl-data/errors"
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
  baseURL?: string
  apiKey?: string
}

export class ESPNClient {
  private client: AxiosInstance
  private readonly apiKey?: string

  constructor(options: ESPNClientOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.ESPN_API_KEY
    this.client = axios.create({
      baseURL: options.baseURL ?? "https://site/api/espn/football",
      timeout: 10_000,
      headers: this.apiKey
        ? {
            Authorization: `Bearer ${this.apiKey}`,
          }
        : undefined,
    })
  }

  async getPlayerStats(params: FetchPlayerStatsParams): Promise<PlayerStat[]> {
    if (!this.apiKey) {
      throw new NFLDataError("Missing ESPN_API_KEY", { code: "MISSING_API_KEY" })
    }

    try {
      const response = await this.client.get<{ items: PlayerStat[] }>("/player-stats", {
        params,
      })
      return response.data.items ?? []
    } catch (error) {
      throw new NFLDataError("Failed to fetch player stats", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  async getTeamDefense(params: FetchTeamDefenseParams): Promise<TeamDefenseStat[]> {
    if (!this.apiKey) {
      throw new NFLDataError("Missing ESPN_API_KEY", { code: "MISSING_API_KEY" })
    }

    try {
      const response = await this.client.get<{ items: TeamDefenseStat[] }>("/team-defense", {
        params,
      })
      return response.data.items ?? []
    } catch (error) {
      throw new NFLDataError("Failed to fetch team defense stats", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  async getSchedule(params: FetchScheduleParams): Promise<GameSchedule[]> {
    if (!this.apiKey) {
      throw new NFLDataError("Missing ESPN_API_KEY", { code: "MISSING_API_KEY" })
    }

    try {
      const response = await this.client.get<{ items: GameSchedule[] }>("/schedule", {
        params,
      })
      return response.data.items ?? []
    } catch (error) {
      throw new NFLDataError("Failed to fetch schedule", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }

  async getInjuryReports(params: FetchInjuryReportParams): Promise<InjuryReport[]> {
    if (!this.apiKey) {
      throw new NFLDataError("Missing ESPN_API_KEY", { code: "MISSING_API_KEY" })
    }

    try {
      const response = await this.client.get<{ items: InjuryReport[] }>("/injuries", {
        params,
      })
      return response.data.items ?? []
    } catch (error) {
      throw new NFLDataError("Failed to fetch injury reports", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }
}
