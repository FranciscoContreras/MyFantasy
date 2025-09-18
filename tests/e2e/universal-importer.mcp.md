# Universal League Import Handler (Playwright MCP)

Use this workflow to trigger platform-specific importers through the universal handler. The handler auto-detects platform from the URL when possible and routes to the appropriate importer.

## Example (ESPN)

```
Playwright: run script
script: lib/league-importers/universal/run.ts
args:
  source: "https://fantasy.espn.com/football/team?leagueId=123456&season=2024"
  screenshotDashboard: "./tmp/screenshots/universal-espn-dashboard.png"
```

## Example (Yahoo)

```
Playwright: run script
script: lib/league-importers/universal/run.ts
args:
  source: "https://football.fantasysports.yahoo.com/f1/98765"
  screenshotDashboard: "./tmp/screenshots/universal-yahoo-dashboard.png"
```

The script requests credentials via the credential provider hook. Provide your credentials when prompted in the MCP client.

## Notes

- The handler emits progress events that the CLI prints to stdout.
- Screenshots are optional but recommended for verification.
- If a platform import fails, the handler returns normalized sample data instead of throwing.
- Extend `lib/league-importers/universal/handler.ts` to plug in queue/persistence logic.
