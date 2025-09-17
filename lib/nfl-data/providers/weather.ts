import axios, { type AxiosInstance } from "axios"

import { NFLDataError } from "@/lib/nfl-data/errors"
import type { FetchWeatherParams, WeatherReport } from "@/lib/nfl-data/types"

interface WeatherClientOptions {
  baseURL?: string
}

export class WeatherClient {
  private client: AxiosInstance

  constructor(options: WeatherClientOptions = {}) {
    this.client = axios.create({
      baseURL: options.baseURL ?? "https://site/api/weather",
      timeout: 10_000,
    })
  }

  async getWeather(params: FetchWeatherParams): Promise<WeatherReport[]> {
    try {
      const response = await this.client.get<{ items: WeatherReport[] }>("/nfl", {
        params,
      })
      return response.data.items ?? []
    } catch (error) {
      throw new NFLDataError("Failed to fetch weather data", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }
}
