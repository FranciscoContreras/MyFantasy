import { NFLDataError } from "@/lib/nfl-data/errors"
import { fetchJson } from "@/lib/nfl-data/http"
import type { FetchWeatherParams, WeatherReport } from "@/lib/nfl-data/types"

export class WeatherClient {
  constructor(private readonly options: { baseURL?: string; timeoutMs?: number } = {}) {}

  async getWeather(params: FetchWeatherParams): Promise<WeatherReport[]> {
    try {
      const data = await fetchJson<{ items: WeatherReport[] }>(new URL("/nfl", this.options.baseURL ?? "https://site/api/weather"), {
        params,
        timeoutMs: this.options.timeoutMs ?? 10_000,
      })
      return data.items ?? []
    } catch (error) {
      throw new NFLDataError("Failed to fetch weather data", {
        code: "REQUEST_FAILED",
        cause: error,
        meta: params,
      })
    }
  }
}
