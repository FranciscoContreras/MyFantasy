# Playwright MCP Scraping Service

The scraping layer bridges Playwright MCP commands with our NFL data domain so providers can fall back to browser automation when official APIs stall.

## Components

- `PlaywrightMCPClient` (`lib/nfl-data/playwright/client.ts`) exposes `run` and delegates to a transport.
- `PlaywrightScrapingService` (`lib/nfl-data/playwright/scraper.ts`) wraps domain-specific commands like `scrapePlayerStats`, `scrapeSchedule`, and `scrapeWeather`.
- Command and payload typings live in `lib/nfl-data/playwright/types.ts` for autocomplete and validation.

## Transport wiring

Plug in your MCP transport at boot:

```ts
import { PlaywrightMCPClient, PlaywrightScrapingService } from "@/lib/nfl-data/playwright"
import { createMCPTransport } from "@/mcp/playwright-transport"

const scrapingService = new PlaywrightScrapingService(
  new PlaywrightMCPClient(createMCPTransport()),
)
```

The default client throws `NFLDataError` with code `NOT_IMPLEMENTED` so developers are reminded to register a transport in non-test environments.

## Supported Commands

| Command ID | Description | Sample MCP Prompt |
| --- | --- | --- |
| `scrape-espn-player-stats` | Pull live player data | "Navigate to ESPN NFL stats page and extract player data for week {{week}}" |
| `scrape-espn-team-defense` | Collect defensive coordinator metrics | "Scrape defensive coordinator information from Pro Football Reference" |
| `scrape-espn-schedule` | Fetch game schedule | "Navigate to ESPN NFL schedule and extract upcoming games for week {{week}}" |
| `scrape-espn-injuries` | Capture injury designations | "Extract injury reports from ESPN and NFL.com" |
| `scrape-nfl-weather` | Collect weather data | "Extract weather data from NFL.com game pages for games {{gameIds}}" |
| `sync-historical-dataset` | Batch historical syncing | "Capture advanced metrics from Football Outsiders for season {{season}}" |

All commands accept JSON arguments matching the payload definitions in `types.ts`. The service normalizes arrays into `PlayerStat`, `GameSchedule`, `InjuryReport`, etc. If MCP returns mixed shapes, invalid items are dropped.

## Usage from NFLDataService

`NFLDataService` accepts an optional `scraper` instance. When direct API calls fail, it will attempt a MCP scrape before returning cached fallbacks. Example wiring:

```ts
import { NFLDataService } from "@/lib/nfl-data"
import { PlaywrightScrapingService, PlaywrightMCPClient } from "@/lib/nfl-data/playwright"

export const nflDataService = new NFLDataService({
  scraper: new PlaywrightScrapingService(new PlaywrightMCPClient(createMCPTransport())),
})
```

Set `context.reason` to include `refresh` when forcing a re-scrape and adjust `ttlMs` to control caching.

## Next Steps

1. Implement `createMCPTransport` to call the Playwright MCP server (e.g., via WebSocket or stdio bridge).
2. Extend the service with additional commands (Yahoo import, CBS scraping, etc.).
3. Capture screenshots and HTML in the transport for debugging automation failures.
