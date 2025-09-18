# Sleeper League Importer (Hybrid API + Playwright MCP)

This workflow combines Sleeper's public API with Playwright automation to capture web-only data (chat history, screenshots).

## Prerequisites

- Sleeper username and password
- Sleeper league ID (e.g. `987654321`)
- Playwright MCP agent within your Claude Code session

## Workflow Steps

1. **Launch Playwright session**
   ```
   Playwright: open chromium
   ```

2. **Execute hybrid importer**
   ```
   Playwright: run script
   script: lib/league-importers/sleeper/playwright-runner.ts
   args:
     leagueId: "987654321"
     username: "${SLEEPER_USERNAME}"
     password: "${SLEEPER_PASSWORD}"
     screenshotSettings: "./tmp/screenshots/sleeper-league-settings.png"
     screenshotChat: "./tmp/screenshots/sleeper-league-chat.png"
     chatLimit: 40
   ```

3. **Review console output**
   - Confirm JSON includes API-derived league/roster/scoring/transactions
   - Verify merged chat messages with web-only entries
   - Save JSON to `.tmp/imports/sleeper-<leagueId>.json`

4. **Validate screenshots**
   - Ensure league settings and chat panels were captured via Playwright

5. **Optional: API-only refresh**
   ```
   node -e "import('./lib/league-importers/sleeper/api.ts').then(async (m) => console.log(JSON.stringify(await m.buildSleeperImportViaApi('987654321'), null, 2)))"
   ```

## Notes

- Sleeper API provides most structured data; Playwright fills chat and screenshot gaps.
- Multi-factor auth is not common on Sleeper, but manual intervention may be required if prompted.
- Update selectors in `lib/league-importers/sleeper/automation.ts` if Sleeper changes DOM attributes.
- Consider persisting the combined result and screenshot paths for audit history.
