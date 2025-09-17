# Player Analysis Engine

The player analysis engine combines seven weighted factors to produce a normalized score, confidence value, and start/sit recommendation for a given week.

## Factors & Weights

| Factor | Weight | Data sources |
| --- | --- | --- |
| Historical performance | 0.20 | Player stats (current & previous season) |
| Matchup difficulty | 0.20 | Opponent defensive rankings |
| Defensive scheme impact | 0.15 | Defensive turnovers, yards allowed |
| Coordinator tendencies | 0.10 | (Placeholder) coordinator metrics & play-calling data |
| Recent form | 0.20 | Last three games vs season average |
| Injury impact | 0.10 | Team injury reports |
| Weather impact | 0.05 | Weather reports for the matchup |

Each factor returns a score between 0 and 1 plus a reliability value so the engine can down-weight noisy inputs when building its confidence metric.

## Usage

```ts
import { playerAnalysisEngine } from "@/lib/analysis"

const result = await playerAnalysisEngine.analyzePlayer({
  playerId: "player_123",
  season: 2024,
  week: 5,
  teamId: "team_abc",
  position: "WR",
})

console.log(result.compositeScore, result.recommendation)
```

The engine reaches out to `NFLDataService` for stats, schedule, defense data, injury reports, and weather. When API data is unavailable, it automatically triggers the Playwright MCP scraper fallback.

## Next Steps

- Replace coordinator placeholder data with real Playwright MCP scraping commands.
- Persist analysis results per week to avoid recomputation during heavy load.
- Feed outputs into the lineup optimizer once Task 3.4 is in place.
