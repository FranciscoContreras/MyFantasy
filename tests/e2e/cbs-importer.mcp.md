# CBS Sports League Importer (Playwright MCP)

CBS Sports does not expose a public API, so the importer relies entirely on Playwright automation.

## Prerequisites

- CBS Fantasy account credentials with league access
- League dashboard URL (e.g. `https://www.cbssports.com/fantasy/football/league/pacific-premier`)
- Playwright MCP agent available in your Claude Code session

## Workflow Steps

1. **Launch Playwright session**
   ```
   Playwright: open chromium
   ```

2. **Run importer script**
   ```
   Playwright: run script
   script: lib/league-importers/cbs/playwright-runner.ts
   args:
     leagueUrl: "https://www.cbssports.com/fantasy/football/league/pacific-premier"
     username: "${CBS_USERNAME}"
     password: "${CBS_PASSWORD}"
     screenshotDashboard: "./tmp/screenshots/cbs-league-dashboard.png"
     screenshotScoring: "./tmp/screenshots/cbs-scoring.png"
     screenshotPlayerNotes: "./tmp/screenshots/cbs-player-notes.png"
     retryCount: 2
   ```

3. **Monitor console output**
   - JSON payload should include league meta, teams, rosters, scoring rules, and player notes.
   - Save JSON to `.tmp/imports/cbs-<league>.json` for auditing.

4. **Verify screenshots**
   - Confirm dashboard, scoring, and player notes pages were captured.

5. **Handle CAPTCHAs if prompted**
   - Importer waits 20 seconds for manual CAPTCHA completion.
   - Rerun importer if CBS blocks automation attempts.

## Notes

- Each retry clears cookies and permissions to mimic a fresh session.
- Update selectors in `lib/league-importers/cbs/automation.ts` if CBS changes their DOM structure.
- Player notes extraction may miss premium-content sections; extend selectors as needed.
- If repeated CAPTCHAs occur, switch to headful mode (`headless: false`) and complete the flow manually.
