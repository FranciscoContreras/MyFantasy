import type { Page } from "playwright"

import type {
  EspnLeagueApiResponse,
  EspnLeagueImportResult,
  EspnRosterEntryApi,
  EspnScoringItemApi,
  EspnRosterSlotApi,
  EspnStandingEntry,
  EspnTeamInfo,
  EspnTeamApi,
  EspnTransactionApi,
} from "@/lib/league-importers/espn/types"

export interface EspnImporterOptions {
  leagueId: string
  season: number
  username?: string
  password?: string
  headless?: boolean
  screenshotPath?: string
}

export class EspnLeagueImporter {
  constructor(private readonly options: EspnImporterOptions) {}

  async run(page: Page): Promise<EspnLeagueImportResult> {
    await this.authenticate(page)
    await this.navigateToLeague(page)

    const league = await this.collectLeagueInfo(page)
    const teams = await this.collectTeams(page)
    const rosters = await this.collectRosters(page)
    const scoring = await this.collectScoring(page)
    const transactions = await this.collectTransactions(page)
    const standings = this.buildStandings(teams)

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
      standings,
    }
  }

  private async authenticate(page: Page) {
    if (!this.options.username || !this.options.password) {
      throw new Error("ESPN credentials required for importer")
    }

    await page.goto("https://www.espn.com/login/")
    await page.fill('input[name="username"]', this.options.username)
    await page.click("button[type=submit]")
    await page.fill('input[name="password"]', this.options.password)
    await Promise.all([
      page.waitForURL((url) => url.hostname.endsWith("espn.com"), { timeout: 15000 }),
      page.click("button[type=submit]")
    ])
  }

  private async navigateToLeague(page: Page) {
    const { leagueId, season } = this.options
    await page.goto(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}`)
    await page.waitForLoadState("networkidle")
  }

  private async collectLeagueInfo(page: Page) {
    const response = await this.fetchLeagueData(page)
    return {
      id: String(response.id),
      name: response.settings?.name ?? "",
      season: response.seasonId,
      scoringPeriodId: response.scoringPeriodId,
      currentMatchupPeriod: response.status?.currentMatchupPeriod ?? 0,
      scoringType: response.settings?.scoringSettings?.matchupTieRule === 1 ? "H2H" : "Points",
      draftType: response.settings?.draftSettings?.type ?? "unknown",
      playoffSeedings: response.settings?.scheduleSettings?.playoffMatchupPeriodIds?.map((seed: number, index: number) => ({
        seed: index + 1,
        teamId: String(response.teams?.[index]?.id ?? "")
      })),
    }
  }

  private async collectTeams(page: Page) {
    const response = await this.fetchLeagueData(page)
    return (response.teams ?? []).map((team: EspnTeamApi) => ({
      id: String(team.id),
      name: team.nickname ?? team.location ?? "Team",
      abbreviation: team.abbrev ?? "",
      owner: {
        displayName: team.owners?.[0] ?? "Unknown",
      },
      logoUrl: team.logo,
      record: {
        wins: team.record?.overall?.wins ?? 0,
        losses: team.record?.overall?.losses ?? 0,
        ties: team.record?.overall?.ties ?? 0,
      },
      projectedRank: team.playoffSeed,
      pointsFor: team.record?.overall?.pointsFor,
      pointsAgainst: team.record?.overall?.pointsAgainst,
    }))
  }

  private async collectRosters(page: Page) {
    const { leagueId, season } = this.options
    const response: EspnLeagueApiResponse = await page.evaluate(async ({ leagueId: lid, season: yr }) => {
      const res = await fetch(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${yr}/segments/0/leagues/${lid}?view=mRoster&view=mTeam&view=modular&view=mBoxscore`)
      return res.json()
    }, { leagueId, season })

    return (response.teams ?? []).map((team: EspnTeamApi) => ({
      teamId: String(team.id),
      players: (team.roster?.entries ?? []).map((entry: EspnRosterEntryApi) => ({
        id: String(entry.playerId),
        fullName: entry.playerPoolEntry?.player?.fullName ?? "Unknown",
        position: entry.playerPoolEntry?.player?.defaultPositionId ? String(entry.playerPoolEntry.player.defaultPositionId) : "",
        proTeam: entry.playerPoolEntry?.player?.proTeamAbbreviation ?? "",
        lineupSlot: entry.lineupSlotId ? String(entry.lineupSlotId) : "",
        injuryStatus: entry.playerPoolEntry?.player?.injuryStatus,
        obtainedVia: entry.playerPoolEntry?.player?.acquisitionType,
        projectedPoints: entry.playerPoolEntry?.appliedStatTotal,
        actualPoints: entry.playerPoolEntry?.player?.stats?.[0]?.appliedTotal,
        percentOwned: entry.playerPoolEntry?.player?.ownership?.percentOwned,
      }))
    }))
  }

  private async collectScoring(page: Page) {
    const response = await this.fetchLeagueData(page)
    const categories: EspnScoringItemApi[] = response.settings?.scoringSettings?.scoringItems ?? []
    const rosterSlots: EspnRosterSlotApi[] = response.settings?.rosterSettings?.lineupSlots ?? []

    return {
      categories: categories.map((item) => ({
        categoryId: item.statId,
        statName: item.statName,
        points: item.points,
      })),
      rosterSlots: rosterSlots.map((slot) => ({
        slot: slot.slotCategoryId ?? "",
        count: slot.count,
      })),
      acquisitionLimits: {
        tradeDeadline: response.settings?.tradeSettings?.deadlineDate,
        totalMoves: response.settings?.rosterSettings?.lineupSlotCounts?.length,
        faabBudget: response.settings?.acquisitionSettings?.faabBudget,
      },
    }
  }

  private async collectTransactions(page: Page) {
    const { leagueId, season } = this.options
    const response: EspnLeagueApiResponse = await page.evaluate(async ({ lid, yr }) => {
      const res = await fetch(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${yr}/segments/0/leagues/${lid}?view=mTransactions`)
      return res.json()
    }, { lid: leagueId, yr: season })

    return (response.transactions ?? []).slice(0, 25).map((transaction: EspnTransactionApi) => ({
      id: String(transaction.id),
      type: transaction.type ?? "Other",
      executedAt: transaction.processDate ? new Date(transaction.processDate).toISOString() : new Date().toISOString(),
      details: transaction.messages?.map((m) => m.text).filter(Boolean).join(" \u2022 ") ?? "",
      teamsInvolved: transaction.teams?.map((team) => String(team.teamId)) ?? [],
    }))
  }

  private buildStandings(teams: EspnTeamInfo[]): EspnStandingEntry[] {
    return teams
      .map((team) => {
        const wins = team.record?.wins ?? 0
        const losses = team.record?.losses ?? 0
        const ties = team.record?.ties ?? 0
        const winPct = wins + losses + ties > 0 ? wins / (wins + losses + ties) : 0
        const standing: EspnStandingEntry = {
          teamId: team.id,
          wins,
          losses,
          ties,
          winPct: Number(winPct.toFixed(3)),
          pointsFor: team.pointsFor,
        }
        return standing
      })
      .sort((a, b) => b.winPct - a.winPct || b.wins - a.wins)
  }

  private async fetchLeagueData(page: Page): Promise<EspnLeagueApiResponse> {
    const { leagueId, season } = this.options
    return page.evaluate(async ({ lid, yr }) => {
      const response = await fetch(`https://fantasy.espn.com/apis/v3/games/ffl/seasons/${yr}/segments/0/leagues/${lid}?view=mTeam&view=mSettings&view=mStatus`)
      return response.json()
    }, { lid: leagueId, yr: season })
  }
}
