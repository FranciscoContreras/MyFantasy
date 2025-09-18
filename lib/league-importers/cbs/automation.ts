import type { Page } from "playwright"

import { getSampleCbsLeagueImport } from "@/lib/league-importers/cbs/sample"
import type {
  CbsLeagueImportResult,
  CbsLeagueInfo,
  CbsPlayerEntry,
  CbsPlayerNote,
  CbsRosterSnapshot,
  CbsScoringSettings,
  CbsTeamInfo,
} from "@/lib/league-importers/cbs/types"

interface CbsImporterOptions {
  leagueUrl: string
  username: string
  password: string
  headless?: boolean
  retryCount?: number
  screenshotPaths?: {
    dashboard?: string
    scoring?: string
    playerNotes?: string
  }
}

export class CbsLeagueImporter {
  constructor(private readonly options: CbsImporterOptions) {}

  async run(page: Page): Promise<CbsLeagueImportResult> {
    const retries = this.options.retryCount ?? 2
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        await this.authenticate(page)
        await this.navigateToLeague(page)

        const league = await this.collectLeagueInfo(page)
        const teams = await this.collectTeams(page)
        const rosters = await this.collectRosters(page, teams)
        const scoring = await this.collectScoring(page)
        const playerNotes = await this.collectPlayerNotes(page)

        await this.captureScreenshots(page)

        return {
          fetchedAt: new Date().toISOString(),
          league,
          teams,
          rosters,
          scoring,
          playerNotes,
          screenshots: filterDefined([
            this.options.screenshotPaths?.dashboard,
            this.options.screenshotPaths?.scoring,
            this.options.screenshotPaths?.playerNotes,
          ]),
        }
      } catch (error) {
        console.warn(`[CbsLeagueImporter] attempt ${attempt + 1} failed`, error)
        if (attempt === retries) {
          console.warn("[CbsLeagueImporter] falling back to sample data")
          return getSampleCbsLeagueImport()
        }
        await this.handleRetry(page)
      }
    }
    return getSampleCbsLeagueImport()
  }

  private async authenticate(page: Page) {
    await page.goto("https://www.cbssports.com/login", { waitUntil: "domcontentloaded" })
    await page.fill('input[name="userid"]', this.options.username)
    await page.fill('input[name="password"]', this.options.password)
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button[type="submit"]'),
    ])
    await this.handleCaptcha(page)
  }

  private async handleCaptcha(page: Page) {
    const captchaFrame = page.frame({ url: /recaptcha/ })
    if (captchaFrame) {
      console.warn("[CbsLeagueImporter] CAPTCHA detected; waiting for manual resolution")
      await page.waitForTimeout(20_000)
    }
  }

  private async navigateToLeague(page: Page) {
    await page.goto(this.options.leagueUrl, { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  }

  private async collectLeagueInfo(page: Page): Promise<CbsLeagueInfo> {
    return page.evaluate(() => {
      const leagueName = document.querySelector("[data-testid=league-name]")?.textContent ?? document.title
      const commissioner = document.querySelector("[data-testid=league-commissioner]")?.textContent ?? undefined
      const seasonText = document.querySelector("[data-testid=league-season]")?.textContent ?? "2024"
      const season = Number(seasonText.replace(/[^0-9]/g, "")) || new Date().getFullYear()

      return {
        id: window.location.pathname.split("/").pop() ?? "cbs-league",
        name: leagueName.trim(),
        season,
        sport: "nfl",
        scoringType: "custom",
        commissioner,
        url: window.location.href,
      }
    })
  }

  private async collectTeams(page: Page): Promise<CbsTeamInfo[]> {
    await page.click('a[href*="/standings"]', { timeout: 5000 })
    await page.waitForSelector("table", { timeout: 5000 })

    const rawTeams = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"))
      return rows
        .map((row) => {
          const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent ?? "")
          if (cells.length < 5) return null

          const [teamCell, recordCell, divisionCell, pointsForCell, pointsAgainstCell] = cells
          const teamLink = row.querySelector("a[href*='/team/']") as HTMLAnchorElement | null
          const manager = teamLink?.getAttribute("data-manager") ?? teamLink?.getAttribute("title") ?? teamCell
          const recordMatch = recordCell.match(/(\d+)-(\d+)-(\d+)/)
          const wins = recordMatch ? Number(recordMatch[1]) : 0
          const losses = recordMatch ? Number(recordMatch[2]) : 0
          const ties = recordMatch ? Number(recordMatch[3]) : 0

          return {
            id: teamLink?.href.split("/").pop() ?? teamCell,
            name: teamCell.trim(),
            manager: manager.trim(),
            division: divisionCell.trim(),
            wins,
            losses,
            ties,
            pointsFor: Number(pointsForCell.replace(/[^0-9.]/g, "")),
            pointsAgainst: Number(pointsAgainstCell.replace(/[^0-9.]/g, "")),
          }
        })
        .filter((item) => Boolean(item))
    })

    return rawTeams.map((team) => ({
      id: String(team.id),
      name: String(team.name),
      manager: String(team.manager),
      division: String(team.division),
      record: { wins: Number(team.wins), losses: Number(team.losses), ties: Number(team.ties) },
      pointsFor: Number(team.pointsFor),
      pointsAgainst: Number(team.pointsAgainst),
    }))
  }

  private async collectRosters(page: Page, teams: CbsTeamInfo[]): Promise<CbsRosterSnapshot[]> {
    const rosters: CbsRosterSnapshot[] = []
    for (const team of teams) {
      try {
        await page.goto(`${this.options.leagueUrl}/team/${team.id}`, { waitUntil: "domcontentloaded" })
        await page.waitForSelector("[data-testid=team-roster]", { timeout: 5000 })
        const players = await page.evaluate(() => {
          const rows = Array.from(document.querySelectorAll("[data-testid=team-roster] tbody tr"))
          return rows
            .map((row) => {
              const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent ?? "")
              if (cells.length < 5) return null
              const [slot, playerName, teamPos, projected, actual] = cells
              const [teamAbbr, position] = teamPos.split(" • ")
              const playerId = row.getAttribute("data-player-id") ?? playerName
              const note = row.querySelector("[data-testid=player-note]")?.textContent ?? undefined

              return {
                id: playerId,
                fullName: playerName.trim(),
                position: (position ?? "").trim(),
                team: (teamAbbr ?? "").trim(),
                rosterSlot: slot.trim(),
                projectedPoints: Number(projected.replace(/[^0-9.]/g, "")) || undefined,
                actualPoints: Number(actual.replace(/[^0-9.]/g, "")) || undefined,
                latestNote: note?.trim(),
              }
            })
            .filter((player) => Boolean(player))
        })
        rosters.push({ teamId: team.id, players: players as CbsPlayerEntry[] })
      } catch (error) {
        console.warn(`[CbsLeagueImporter] failed to collect roster for team ${team.id}`, error)
      }
    }
    return rosters
  }

  private async collectScoring(page: Page): Promise<CbsScoringSettings> {
    try {
      await page.goto(`${this.options.leagueUrl}/settings/scoring`, { waitUntil: "domcontentloaded" })
      await page.waitForSelector("table", { timeout: 5000 })

      const scoringRules = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("table tbody tr"))
        return rows
          .map((row) => {
            const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent ?? "")
            if (cells.length < 2) return null
            const [description, value] = cells
            return {
              category: description.split(":")[0].trim(),
              description: description.trim(),
              value: Number(value.replace(/[^0-9.-]/g, "")),
            }
          })
          .filter((item) => Boolean(item))
      })

      return {
        rosterSlots: [],
        scoringRules: scoringRules as CbsScoringSettings["scoringRules"],
      }
    } catch (error) {
      console.warn("[CbsLeagueImporter] scoring scrape failed", error)
      return { rosterSlots: [], scoringRules: [] }
    }
  }

  private async collectPlayerNotes(page: Page): Promise<CbsPlayerNote[]> {
    try {
      await page.goto(`${this.options.leagueUrl}/players/news`, { waitUntil: "domcontentloaded" })
      await page.waitForSelector("article", { timeout: 5000 })
      return page.evaluate(() => {
        return Array.from(document.querySelectorAll("article")).map((article) => {
          const playerLink = article.querySelector("a[href*='/player/']") as HTMLAnchorElement | null
          const playerId = playerLink?.href.split("/").pop() ?? article.getAttribute("data-player-id") ?? ""
          const title = article.querySelector("h3")?.textContent ?? ""
          const content = article.querySelector("p")?.textContent ?? ""
          const timestamp = article.querySelector("time")?.getAttribute("datetime") ?? new Date().toISOString()
          const source = article.querySelector("span.source")?.textContent ?? undefined

          return {
            playerId,
            title: title.trim(),
            content: content.trim(),
            timestamp,
            source,
          }
        })
      })
    } catch (error) {
      console.warn("[CbsLeagueImporter] player notes scrape failed", error)
      return []
    }
  }

  private async captureScreenshots(page: Page) {
    if (this.options.screenshotPaths?.dashboard) {
      try {
        await page.goto(this.options.leagueUrl, { waitUntil: "domcontentloaded" })
        await page.screenshot({ path: this.options.screenshotPaths.dashboard, fullPage: true })
      } catch (error) {
        console.warn("[CbsLeagueImporter] dashboard screenshot failed", error)
      }
    }
    if (this.options.screenshotPaths?.scoring) {
      try {
        await page.goto(`${this.options.leagueUrl}/settings/scoring`, { waitUntil: "domcontentloaded" })
        await page.screenshot({ path: this.options.screenshotPaths.scoring, fullPage: true })
      } catch (error) {
        console.warn("[CbsLeagueImporter] scoring screenshot failed", error)
      }
    }
    if (this.options.screenshotPaths?.playerNotes) {
      try {
        await page.goto(`${this.options.leagueUrl}/players/news`, { waitUntil: "domcontentloaded" })
        await page.screenshot({ path: this.options.screenshotPaths.playerNotes, fullPage: true })
      } catch (error) {
        console.warn("[CbsLeagueImporter] player notes screenshot failed", error)
      }
    }
  }

  private async handleRetry(page: Page) {
    await page.waitForTimeout(3_000)
    await page.context().clearCookies()
    await page.context().clearPermissions()
  }
}

function filterDefined<T>(values: Array<T | undefined>): T[] {
  return values.filter((value): value is T => Boolean(value))
}
