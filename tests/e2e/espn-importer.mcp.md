# ESPN League Importer (Playwright MCP)

This workflow demonstrates how to orchestrate the ESPN league import via the Playwright MCP agent.

## Prerequisites

- ESPN username/password with access to the target league
- League ID and season number (e.g. league `123456` in season `2024`)
- Playwright MCP agent available in your Claude Code session

## Workflow Steps

1. **Launch importer session**
   ```
   Playwright: open chromium
   ```

2. **Run import script**
   ```
   Playwright: run script
   script: lib/league-importers/espn/playwright-runner.ts
   args:
     leagueId: "123456"
     season: 2024
     username: "${ESPN_USERNAME}"
     password: "${ESPN_PASSWORD}"
     screenshot: "./tmp/screenshots/espn-league-dashboard.png"
   ```

3. **Validate extracted data**
   - Inspect JSON output printed to console (saved under `.tmp/imports/espn-<leagueId>.json`)
   - Confirm teams, roster slots, and scoring categories match league UI

4. **Screenshot for verification**
   - The runner saves a full-page screenshot to the path provided via `screenshot` argument.

5. **Attach import artifact**
   - Upload JSON + screenshot to integration logs or project management tool

## Notes

- The importer uses ESPN's private JSON endpoints (`mTeam`, `mRoster`, `mTransactions`). If the API schema changes, update `lib/league-importers/espn/automation.ts` accordingly.
- Two-factor authentication prompts are not handled automatically; complete the OTP challenge manually if prompted.
- The Playwright agent runs in headless mode by default. Set `headless: false` in the runner script options to watch the flow.
