# Yahoo Fantasy League Importer (Playwright MCP)

This workflow automates the Yahoo Fantasy import using the Playwright MCP agent.

## Prerequisites

- Yahoo account with access to the league
- Yahoo league key (e.g. `410.l.98765`)
- Optional league URL (if the league is under a custom slug)
- Playwright MCP agent available in your Claude Code session

## Workflow Steps

1. **Launch browser session**
   ```
   Playwright: open chromium
   ```

2. **Execute importer script**
   ```
   Playwright: run script
   script: lib/league-importers/yahoo/playwright-runner.ts
   args:
     leagueKey: "410.l.98765"
     leagueUrl: "https://football.fantasysports.yahoo.com/f1/98765"
     username: "${YAHOO_USERNAME}"
     password: "${YAHOO_PASSWORD}"
     screenshot: "./tmp/screenshots/yahoo-league-dashboard.png"
   ```

3. **Review console output**
   - JSON payload includes league info, teams, rosters, scoring, transactions, and live score snapshot
   - Save the JSON to `.tmp/imports/yahoo-<leagueKey>.json` for auditing

4. **Verify screenshot**
   - Confirm the screenshot captured the league dashboard (saved to `./tmp/screenshots/...`)

5. **Capture multi-league list (optional)**
   ```
   Playwright: run script
   script: lib/league-importers/yahoo/playwright-runner.ts
   args:
     leagueKey: "410.l.98765"
     username: "${YAHOO_USERNAME}"
     password: "${YAHOO_PASSWORD}"
     headless: false
   note: Call importer.listLeagues from a custom script to enumerate available leagues.
   ```

## Notes

- Yahoo login may challenge for MFA. Complete the OTP challenge manually when prompted.
- The importer fetches JSON from `fantasysports.yahooapis.com` using the authenticated browser session.
- Multi-league support is handled via `YahooLeagueImporter.listLeagues`, which reads the multi-league dashboard after authentication.
- Update selectors or parsing logic in `lib/league-importers/yahoo/automation.ts` if Yahoo modifies their front-end state container.
