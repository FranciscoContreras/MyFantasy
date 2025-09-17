# Matchup Analysis Engine

Task 3.3 introduces a matchup-focused analyzer that synthesizes historical performance, positional metrics, scheme intel, and projected game script.

## Workflow

1. Fetch historical player vs opponent samples (using `NFLDataService` fallbacks).
2. Derive positional defensive rankings and allowances.
3. Pull scheme information (placeholder for Playwright MCP scraper).
4. Build game-script projections (pace, pass rate, margin).
5. Assemble factor scores with impact weighting.

## Output Structure

```ts
const result = await matchupAnalysisEngine.analyze({
  playerId: "player_123",
  teamId: "team_001",
  opponentTeamId: "team_045",
  season: 2024,
  week: 7,
  position: "WR",
})
```

Result fields include:
- `factors`: player-vs-defense, position strength, scheme advantage, game script.
- `gameScript`: pace, expected plays, pass rate, projected margin.
- `overallScore`: weighted aggregate.
- `volatility`: historical variance adjusted by factor reliability.
- `trends` and `recommendedAdjustments`: narrative hooks for UI.

## Data Source Extension

`DefaultMatchupDataSource` uses existing services but is designed for override. For accurate scheme data, implement `fetchSchemeIntel` with Playwright MCP commands.

```ts
import { MatchupAnalysisEngine } from "@/lib/analysis/matchups"
import { EspnPlaywrightSource } from "@/lib/analysis/matchups/espn-source"

const engine = new MatchupAnalysisEngine(new EspnPlaywrightSource())
```

## Next Steps

- Integrate actual scheme intel via MCP (blitz rates, coverage splits).
- Persist matchup analytics for the optimizer to reuse during lineup simulations.
- Add automated tests comparing projected game scripts against historical pace data.
