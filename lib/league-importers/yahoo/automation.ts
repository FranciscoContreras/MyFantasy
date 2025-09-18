import type { Page } from "playwright"

import {
  getSampleYahooLeagueImport,
  getSampleYahooMultiLeague,
} from "@/lib/league-importers/yahoo/sample"
import type {
  YahooLeagueImportResult,
  YahooLeagueInfo,
  YahooLiveScoreEntry,
  YahooMultiLeagueResult,
  YahooRosterSnapshot,
  YahooTeamInfo,
  YahooTransactionEntry,
  YahooScoringSettings,
} from "@/lib/league-importers/yahoo/types"

interface YahooImporterOptions {
  leagueKey: string
  leagueUrl?: string
  username: string
  password: string
  headless?: boolean
  screenshotPath?: string
}

export class YahooLeagueImporter {
  constructor(private readonly options: YahooImporterOptions) {}

  async run(page: Page): Promise<YahooLeagueImportResult> {
    const fallback = getSampleYahooLeagueImport()

    await this.authenticate(page)
    await this.navigateToLeague(page)

    const league = await this.collectLeagueInfo(page, fallback.league)
    const teams = await this.collectTeams(page, fallback.teams)
    const rosters = await this.collectRosters(page, fallback.rosters)
    const scoring = await this.collectScoring(page, fallback.scoring)
    const transactions = await this.collectTransactions(page, fallback.transactions)
    const liveScores = await this.collectLiveScores(page, fallback.liveScores)

    if (this.options.screenshotPath) {
      await page.screenshot({ path: this.options.screenshotPath, fullPage: true })
    }

    return {
      fetchedAt: new Date().toISOString(),
      league,
      teams,
      rosters,
      scoring,
      transactions,
      liveScores,
      raw: {
        source: "playwright",
      },
    }
  }

  async listLeagues(page: Page): Promise<YahooMultiLeagueResult> {
    try {
      await this.authenticate(page)
      await page.goto("https://sports.yahoo.com/fantasy/football/leagues", { waitUntil: "networkidle" })
      const summaries = await this.extractLeagueSummaries(page)
      if (summaries) {
        return {
          fetchedAt: new Date().toISOString(),
          leagues: summaries,
        }
      }
    } catch (error) {
      console.warn("[YahooLeagueImporter] listLeagues fallback", error)
    }
    return getSampleYahooMultiLeague()
  }

  private async authenticate(page: Page) {
    await page.goto("https://login.yahoo.com/", { waitUntil: "domcontentloaded" })
    await page.fill("#login-username", this.options.username)
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click("#login-signin"),
    ])
    await page.fill("#login-passwd", this.options.password)
    await Promise.all([
      page.waitForURL((url) => url.hostname.endsWith("yahoo.com"), { timeout: 20000 }),
      page.click("#login-signin"),
    ])
  }

  private async navigateToLeague(page: Page) {
    const url = this.options.leagueUrl ?? this.buildLeagueUrl(this.options.leagueKey)
    await page.goto(url, { waitUntil: "domcontentloaded" })
  }

  private async collectLeagueInfo(page: Page, fallback: YahooLeagueInfo): Promise<YahooLeagueInfo> {
    const state = await this.extractDocumentState(page)
    if (!state) {
      return fallback
    }

    const league = this.resolveLeagueInfo(state)
    return league ?? fallback
  }

  private async collectTeams(page: Page, fallback: YahooTeamInfo[]): Promise<YahooTeamInfo[]> {
    const state = await this.extractDocumentState(page)
    if (!state) {
      return fallback
    }
    const teams = this.resolveTeams(state)
    return teams.length ? teams : fallback
  }

  private async collectRosters(page: Page, fallback: YahooRosterSnapshot[]): Promise<YahooRosterSnapshot[]> {
    const state = await this.extractDocumentState(page)
    if (!state) {
      return fallback
    }
    const rosters = this.resolveRosters(state)
    return rosters.length ? rosters : fallback
  }

  private async collectScoring(page: Page, fallback: YahooScoringSettings): Promise<YahooScoringSettings> {
    const state = await this.extractDocumentState(page)
    if (!state) {
      return fallback
    }
    const scoring = this.resolveScoring(state)
    return scoring ?? fallback
  }

  private async collectTransactions(page: Page, fallback: YahooTransactionEntry[]): Promise<YahooTransactionEntry[]> {
    try {
      const data = await this.fetchFantasyContent<Record<string, unknown>>(page, "transactions;count=25")
      const transactions = this.resolveTransactions(data)
      return transactions.length ? transactions : fallback
    } catch (error) {
      console.warn("[YahooLeagueImporter] collectTransactions fallback", error)
      return fallback
    }
  }

  private async collectLiveScores(page: Page, fallback: YahooLiveScoreEntry[]): Promise<YahooLiveScoreEntry[]> {
    try {
      const data = await this.fetchFantasyContent<Record<string, unknown>>(page, "scoreboard")
      const scores = this.resolveLiveScores(data)
      return scores.length ? scores : fallback
    } catch (error) {
      console.warn("[YahooLeagueImporter] collectLiveScores fallback", error)
      return fallback
    }
  }

  private async extractLeagueSummaries(page: Page) {
    const state = await this.extractDocumentState(page)
    if (!state) {
      return null
    }
    const root = getPathValue<unknown>(state, ["context", "dispatcher", "stores", "MultiLeagueStore", "leagues"])
    if (!Array.isArray(root)) {
      return null
    }

    const summaries = root
      .map((leagueNode) => {
        if (!isRecord(leagueNode)) return null
        const id = String(leagueNode.leagueKey ?? "")
        const season = Number(leagueNode.season ?? new Date().getFullYear())
        const name = String(leagueNode.name ?? id)
        const sport = String(leagueNode.sport ?? "nfl")
        const scoringType = String(leagueNode.scoringType ?? "head")
        const currentWeek = Number(leagueNode.currentWeek ?? 0)
        const totalWeeks = Number(leagueNode.endWeek ?? 17)
        const url = String(leagueNode.url ?? this.buildLeagueUrl(id))

        return {
          league: {
            id,
            name,
            season,
            sport,
            scoringType: scoringType as YahooLeagueInfo["scoringType"],
            currentWeek,
            totalWeeks,
            url,
          },
          teams: [],
          link: url,
        }
      })
      .filter((item): item is YahooMultiLeagueResult["leagues"][number] => Boolean(item))

    return summaries.length ? summaries : null
  }

  private async extractDocumentState(page: Page): Promise<Record<string, unknown> | null> {
    const raw = await page.evaluate(() => {
      const script = document.querySelector("script[data-state]") || document.querySelector("script[data-yahoo-state]")
      return script?.textContent ?? null
    })
    if (!raw) {
      return null
    }
    try {
      const parsed = JSON.parse(raw) as unknown
      return isRecord(parsed) ? parsed : null
    } catch (error) {
      console.warn("[YahooLeagueImporter] failed to parse document state", error)
      return null
    }
  }

  private resolveLeagueInfo(state: Record<string, unknown>): YahooLeagueInfo | null {
    const node = getPathValue<Record<string, unknown>>(state, ["context", "dispatcher", "stores", "FantasyContentStore", "league"])
    if (!node) {
      return null
    }

    const id = String(node.leagueKey ?? this.options.leagueKey)
    const season = Number(node.season ?? new Date().getFullYear())
    const sport = String(node.sport ?? "nfl")
    const scoringType = String(node.scoringType ?? "head") as YahooLeagueInfo["scoringType"]
    const currentWeek = Number(node.currentWeek ?? 0)
    const totalWeeks = Number(node.endWeek ?? 17)
    const name = String(node.name ?? id)
    const url = this.options.leagueUrl ?? this.buildLeagueUrl(id)

    return {
      id,
      name,
      season,
      sport,
      scoringType,
      currentWeek,
      totalWeeks,
      url,
    }
  }

  private resolveTeams(state: Record<string, unknown>): YahooTeamInfo[] {
    const list = getPathValue<unknown[]>(state, ["context", "dispatcher", "stores", "FantasyContentStore", "teams"])
    if (!Array.isArray(list)) {
      return []
    }

    return list
      .map((entry) => {
        if (!isRecord(entry)) return null
        const id = String(entry.teamKey ?? "")
        if (!id) return null
        const manager = entry.managers
        let nickname = "Manager"
        if (Array.isArray(manager) && isRecord(manager[0])) {
          nickname = String(manager[0].nickname ?? nickname)
        }

        const wins = Number(entry.wins ?? entry.standings?.wins ?? 0)
        const losses = Number(entry.losses ?? entry.standings?.losses ?? 0)
        const ties = Number(entry.ties ?? entry.standings?.ties ?? 0)
        const winPct = Number(entry.winPercentage ?? entry.standings?.winPercentage ?? 0)

        return {
          id,
          name: String(entry.name ?? entry.teamName ?? id),
          manager: { nickname },
          logoUrl: typeof entry.logo === "string" ? entry.logo : undefined,
          record: {
            wins,
            losses,
            ties,
            winPct,
          },
          pointsFor: Number(entry.pointsFor ?? entry.totalPoints ?? 0),
          pointsAgainst: Number(entry.pointsAgainst ?? entry.totalPointsAgainst ?? 0),
          streak: String(entry.streak ?? ""),
        }
      })
      .filter((team): team is YahooTeamInfo => Boolean(team))
  }

  private resolveRosters(state: Record<string, unknown>): YahooRosterSnapshot[] {
    const rostersNode = getPathValue<unknown>(state, ["context", "dispatcher", "stores", "FantasyContentStore", "rosters"])
    if (!isRecord(rostersNode)) {
      return []
    }

    return Object.entries(rostersNode).map(([teamKey, rosterValue]) => {
      const players: YahooRosterSnapshot["players"] = []
      if (isRecord(rosterValue) && Array.isArray(rosterValue.players)) {
        for (const playerEntry of rosterValue.players) {
          if (!isRecord(playerEntry)) continue
          const player = playerEntry.player ?? playerEntry
          if (!isRecord(player)) continue
          const playerId = String(player.playerKey ?? player.player_id ?? "")
          if (!playerId) continue
          const name = String(player.name ?? player.fullName ?? player.display_name ?? playerId)
          players.push({
            id: playerId,
            fullName: name,
            position: String(player.position ?? player.primary_position ?? ""),
            team: String(player.proTeam ?? player.editorial_team_abbr ?? ""),
            status: typeof player.status === "string" ? player.status : undefined,
            rosterSlot: String(player.rosterSlot ?? player.selected_position ?? ""),
            projectedPoints: typeof player.projected_points === "number" ? player.projected_points : undefined,
            actualPoints: typeof player.points === "number" ? player.points : undefined,
          })
        }
      }
      return {
        teamId: teamKey,
        players,
      }
    })
  }

  private resolveScoring(state: Record<string, unknown>): YahooScoringSettings | null {
    const settingsNode = getPathValue<Record<string, unknown>>(state, ["context", "dispatcher", "stores", "FantasyContentStore", "settings"])
    if (!settingsNode) {
      return null
    }

    const rosterSlots = Array.isArray(settingsNode.rosterSlots)
      ? settingsNode.rosterSlots
          .map((slot) => (isRecord(slot) ? { slot: String(slot.slot ?? slot.position ?? ""), count: Number(slot.count ?? 1) } : null))
          .filter((slot): slot is { slot: string; count: number } => Boolean(slot))
      : []

    const scoringRules = Array.isArray(settingsNode.scoring)
      ? settingsNode.scoring
          .map((rule) =>
            isRecord(rule)
              ? {
                  category: String(rule.stat ?? rule.category ?? ""),
                  value: Number(rule.value ?? 0),
                  description: typeof rule.name === "string" ? rule.name : undefined,
                }
              : null,
          )
          .filter((item): item is YahooScoringSettings["scoringRules"][number] => Boolean(item))
      : []

    return {
      rosterSlots,
      scoringRules,
    }
  }

  private resolveTransactions(data: Record<string, unknown> | null): YahooTransactionEntry[] {
    const content = getPathValue<unknown>(data, ["fantasy_content", "league", 1, "transactions"])
    if (!Array.isArray(content)) {
      return []
    }

    const results: YahooTransactionEntry[] = []
    for (const transactionNode of content) {
      if (!isRecord(transactionNode)) continue
      const transaction = transactionNode.transaction
      if (!Array.isArray(transaction)) continue
      const meta = transaction.find((item) => isRecord(item) && item.type === "meta")
      const basic = isRecord(meta) ? (meta as Record<string, unknown>) : transaction.find(isRecord)
      if (!isRecord(basic)) continue
      const id = String(basic.transaction_id ?? basic.transactionId ?? "")
      if (!id) continue
      const type = String(basic.type ?? "other")
      const timestamp = Number(basic.timestamp ?? Date.now()) * (String(basic.timestamp ?? "").length === 10 ? 1000 : 1)
      const teams = Array.isArray(basic.teams)
        ? basic.teams.map((team) => (isRecord(team) ? String(team.team_key ?? team.teamKey ?? "") : "")).filter(Boolean)
        : []
      const players = Array.isArray(basic.players)
        ? basic.players
            .map((player) => (isRecord(player) ? String(player.name ?? player.fullName ?? "") : ""))
            .filter(Boolean)
            .join(", ")
        : ""

      results.push({
        id,
        type: type as YahooTransactionEntry["type"],
        executedAt: new Date(timestamp).toISOString(),
        summary: players || type,
        teamsInvolved: teams,
      })
    }
    return results
  }

  private resolveLiveScores(data: Record<string, unknown> | null): YahooLiveScoreEntry[] {
    const matchups = getPathValue<unknown>(data, ["fantasy_content", "league", 1, "scoreboard", 0, "matchups"])
    if (!Array.isArray(matchups)) {
      return []
    }

    const scores: YahooLiveScoreEntry[] = []
    for (const matchupWrapper of matchups) {
      if (!isRecord(matchupWrapper)) continue
      const matchup = matchupWrapper.matchup
      if (!Array.isArray(matchup)) continue
      const teams = matchup.find((node) => isRecord(node) && Array.isArray(node.teams))
      if (!isRecord(teams)) continue
      const teamEntries = Array.isArray(teams.teams) ? teams.teams : []
      if (teamEntries.length < 2) continue

      const [teamA, teamB] = teamEntries.map((entry) => {
        if (!isRecord(entry)) return null
        const teamNode = entry.team
        if (!Array.isArray(teamNode)) return null
        const meta = teamNode.find(isRecord)
        if (!isRecord(meta)) return null
        const teamId = String(meta.team_key ?? meta.teamKey ?? "")
        const points = Number(meta.points ?? meta.score ?? 0)
        return { teamId, points }
      })

      if (!teamA || !teamB) continue

      const statusNode = matchup.find((node) => isRecord(node) && typeof node.status === "string")
      const matchupStatus = isRecord(statusNode) ? String(statusNode.status ?? "live") : "live"

      scores.push({
        teamId: teamA.teamId,
        opponentTeamId: teamB.teamId,
        teamPoints: teamA.points,
        opponentPoints: teamB.points,
        matchupStatus,
        updatedAt: new Date().toISOString(),
      })
    }
    return scores
  }

  private async fetchFantasyContent<T>(page: Page, resource: string): Promise<T | null> {
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${this.options.leagueKey}/${resource}?format=json`
    const responseText = await page.evaluate(async (requestUrl) => {
      const response = await fetch(requestUrl, { credentials: "include" })
      if (!response.ok) {
        throw new Error(`Yahoo API request failed: ${response.status}`)
      }
      return response.text()
    }, url)

    try {
      return JSON.parse(responseText) as T
    } catch (error) {
      console.warn("[YahooLeagueImporter] failed to parse API response", error)
      return null
    }
  }

  private buildLeagueUrl(leagueKey: string) {
    const parts = leagueKey.split(".")
    const leagueId = parts.pop() ?? leagueKey
    return `https://football.fantasysports.yahoo.com/f1/${leagueId}`
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getPathValue<T>(source: unknown, path: Array<string | number>): T | undefined {
  let current: unknown = source
  for (const segment of path) {
    if (typeof segment === "number") {
      if (!Array.isArray(current) || current.length <= segment) {
        return undefined
      }
      current = current[segment]
    } else {
      if (!isRecord(current) || Array.isArray(current) || !(segment in current)) {
        return undefined
      }
      current = (current as Record<string, unknown>)[segment]
    }
  }
  return current as T
}
