import { getChromium } from "@/lib/league-importers/universal/browser"

import { CbsLeagueImporter } from "@/lib/league-importers/cbs/automation"
import { getSampleCbsLeagueImport } from "@/lib/league-importers/cbs/sample"
import type { CbsLeagueImportResult } from "@/lib/league-importers/cbs/types"
import { EspnLeagueImporter } from "@/lib/league-importers/espn/automation"
import { getSampleEspnLeagueImport } from "@/lib/league-importers/espn/sample"
import type { EspnLeagueImportResult } from "@/lib/league-importers/espn/types"
import { SleeperLeagueImporter } from "@/lib/league-importers/sleeper/automation"
import { getSampleSleeperLeagueImport } from "@/lib/league-importers/sleeper/sample"
import type { SleeperLeagueImportResult } from "@/lib/league-importers/sleeper/types"
import { YahooLeagueImporter } from "@/lib/league-importers/yahoo/automation"
import { getSampleYahooLeagueImport } from "@/lib/league-importers/yahoo/sample"
import type { YahooLeagueImportResult } from "@/lib/league-importers/yahoo/types"
import { detectPlatform } from "@/lib/league-importers/universal/detect"
import type {
  ImportCredentials,
  NormalizedLeagueData,
  PlatformImportResult,
  UniversalImportOptions,
  SupportedPlatform,
} from "@/lib/league-importers/universal/types"

export async function runUniversalImport(options: UniversalImportOptions): Promise<NormalizedLeagueData> {
  const detection = options.platform
    ? { platform: options.platform, confidence: 1, details: "Provided by caller" }
    : detectPlatform(options.source)

  const platform = detection.platform
  options.onProgress?.({ platform, step: "detect", message: detection.details, progress: 0.1 })

  const needsCredentials = platform === "espn" || platform === "yahoo" || platform === "cbs"

  let credentials: ImportCredentials | undefined = options.credentials?.[platform]

  if (needsCredentials && !credentials) {
    if (!options.credentialProvider) {
      throw new Error(`Credential provider required for ${platform.toUpperCase()} imports`)
    }
    options.onProgress?.({ platform, step: "credentials", message: "Requesting credentials", progress: 0.2 })
    credentials = await options.credentialProvider({ platform, fields: ["username", "password"] })
    if (!credentials.username || !credentials.password) {
      throw new Error(`Missing credentials for ${platform.toUpperCase()} import`)
    }
  }

  if (platform === "sleeper" && !credentials && options.credentialProvider) {
    credentials = await options.credentialProvider({ platform: "sleeper", fields: ["username", "password"] })
  }

  let browser: Awaited<ReturnType<typeof cachedChromium.launch>> | null = null
  try {
    let importResult: PlatformImportResult
    let screenshots: string[] = []

    if (platform === "sleeper" && !options.screenshots) {
      // Sleeper without screenshots can use API-only path inside the importer
    }

    if (platform === "sleeper" || platform === "espn" || platform === "yahoo" || platform === "cbs") {
      const chromium = await getChromium()
      browser = await chromium.launch({ headless: options.headless ?? true })
    }

    options.onProgress?.({ platform, step: "authenticate", message: "Starting platform importer", progress: 0.35 })

    switch (platform) {
      case "espn": {
        const page = await browser!.newPage()
        const importer = new EspnLeagueImporter({
          leagueId: extractEspnLeagueId(options.source),
          season: extractSeason(options.source),
          username: credentials!.username,
          password: credentials!.password,
          screenshotPath: options.screenshots?.dashboard,
        })
        const result: EspnLeagueImportResult = await importer.run(page)
        screenshots = filterStrings([options.screenshots?.dashboard])
        importResult = { platform: "espn", result }
        break
      }
      case "yahoo": {
        const page = await browser!.newPage()
        const importer = new YahooLeagueImporter({
          leagueKey: extractYahooLeagueKey(options.source),
          leagueUrl: options.source.includes("http") ? options.source : undefined,
          username: credentials!.username,
          password: credentials!.password,
          headless: options.headless,
          screenshotPath: options.screenshots?.dashboard,
        })
        const result: YahooLeagueImportResult = await importer.run(page)
        screenshots = filterStrings([options.screenshots?.dashboard])
        importResult = { platform: "yahoo", result }
        break
      }
      case "sleeper": {
        const page = await browser!.newPage()
        const importer = new SleeperLeagueImporter({
          leagueId: extractSleeperLeagueId(options.source),
          username: credentials?.username ?? "",
          password: credentials?.password ?? "",
          headless: options.headless,
          chatLimit: options.chatLimit,
          screenshots: {
            settings: options.screenshots?.dashboard,
            chat: options.screenshots?.supplemental,
          },
        })
        const result: SleeperLeagueImportResult = await importer.run(page)
        screenshots = filterStrings([options.screenshots?.dashboard, options.screenshots?.supplemental])
        importResult = { platform: "sleeper", result }
        break
      }
      case "cbs": {
        const page = await browser!.newPage()
        const importer = new CbsLeagueImporter({
          leagueUrl: options.source,
          username: credentials!.username,
          password: credentials!.password,
          retryCount: options.retryCount,
          screenshotPaths: {
            dashboard: options.screenshots?.dashboard,
            scoring: options.screenshots?.scoring,
            playerNotes: options.screenshots?.supplemental,
          },
        })
        const result: CbsLeagueImportResult = await importer.run(page)
        screenshots = filterStrings([
          options.screenshots?.dashboard,
          options.screenshots?.scoring,
          options.screenshots?.supplemental,
        ])
        importResult = { platform: "cbs", result }
        break
      }
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }

    options.onProgress?.({ platform, step: "normalize", message: "Normalizing league data", progress: 0.75 })
    const normalized = normalizeImportResult(importResult)
    normalized.verification.screenshots = [...normalized.verification.screenshots, ...screenshots]

    options.onProgress?.({ platform, step: "complete", message: "Import completed", progress: 1 })
    return normalized
  } catch (error) {
    options.onProgress?.({ platform, step: "error", message: String(error), progress: 1, data: { stack: String((error as Error).stack) } })
    return normalizeImportResult({ platform, result: fallbackResult(platform) })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

export function normalizeImportResult(importResult: PlatformImportResult): NormalizedLeagueData {
  switch (importResult.platform) {
    case "espn":
      return normalizeEspn(importResult.result)
    case "yahoo":
      return normalizeYahoo(importResult.result)
    case "sleeper":
      return normalizeSleeper(importResult.result)
    case "cbs":
      return normalizeCbs(importResult.result)
  }
}

function normalizeEspn(result: EspnLeagueImportResult): NormalizedLeagueData {
  return {
    platform: "espn",
    league: {
      id: result.league.id,
      name: result.league.name,
      season: result.league.season,
      scoringType: result.league.scoringType,
    },
    teams: result.teams.map((team) => ({
      id: team.id,
      name: team.name,
      manager: team.owner.displayName,
      record: team.record,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
    })),
    rosters: result.rosters.map((roster) => ({
      teamId: roster.teamId,
      players: roster.players.map((player) => ({
        id: player.id,
        name: player.fullName,
        position: player.position,
        team: player.team,
        slot: player.lineupSlot,
        status: player.injuryStatus,
        projectedPoints: player.projectedPoints,
        actualPoints: player.actualPoints,
        notes: undefined,
      })),
    })),
    scoringRules: result.scoring.categories.map((rule) => ({
      category: String(rule.categoryId),
      value: rule.points,
      description: rule.statName,
    })),
    transactions: result.transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      executedAt: txn.executedAt,
      summary: txn.details,
      teamsInvolved: txn.teamsInvolved,
    })),
    verification: { screenshots: [] },
    raw: result.raw,
  }
}

function normalizeYahoo(result: YahooLeagueImportResult): NormalizedLeagueData {
  return {
    platform: "yahoo",
    league: {
      id: result.league.id,
      name: result.league.name,
      season: result.league.season,
      scoringType: result.league.scoringType,
      url: result.league.url,
    },
    teams: result.teams.map((team) => ({
      id: team.id,
      name: team.name,
      manager: team.manager.nickname,
      record: team.record,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
    })),
    rosters: result.rosters.map((roster) => ({
      teamId: roster.teamId,
      players: roster.players.map((player) => ({
        id: player.id,
        name: player.fullName,
        position: player.position,
        team: player.team,
        slot: player.rosterSlot,
        status: player.status,
        projectedPoints: player.projectedPoints,
        actualPoints: player.actualPoints,
        notes: undefined,
      })),
    })),
    scoringRules: result.scoring.scoringRules,
    transactions: result.transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      executedAt: txn.executedAt,
      summary: txn.summary,
      teamsInvolved: txn.teamsInvolved,
    })),
    verification: { screenshots: [] },
    raw: result.raw,
  }
}

function normalizeSleeper(result: SleeperLeagueImportResult): NormalizedLeagueData {
  return {
    platform: "sleeper",
    league: {
      id: result.league.id,
      name: result.league.name,
      season: result.league.season,
      scoringType: result.league.scoringType,
    },
    teams: result.users.map((user) => ({
      id: user.userId,
      name: user.displayName,
      manager: user.displayName,
    })),
    rosters: result.rosters.map((roster) => ({
      teamId: String(roster.ownerId),
      players: roster.players.map((playerId) => {
        const player = result.players.find((p) => p.playerId === playerId)
        return {
          id: playerId,
          name: player?.fullName ?? playerId,
          position: player?.position,
          team: player?.team,
          slot: roster.starters.includes(playerId)
            ? "starter"
            : roster.taxi.includes(playerId)
              ? "taxi"
              : "bench",
          status: player?.status,
        }
      }),
    })),
    scoringRules: result.settings.scoringRules.map((rule) => ({
      category: rule.stat,
      value: rule.value,
      description: rule.description,
    })),
    transactions: result.transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      executedAt: txn.executedAt,
      summary: Object.keys(txn.adds).length ? `Adds: ${JSON.stringify(txn.adds)}` : undefined,
      teamsInvolved: [...new Set([...Object.keys(txn.adds), ...Object.keys(txn.drops)])],
    })),
    chat: result.chat.map((message) => ({
      id: message.id,
      author: message.authorName,
      message: message.message,
      createdAt: message.createdAt,
    })),
    verification: { screenshots: result.screenshots ?? [] },
    raw: result.raw,
  }
}

function normalizeCbs(result: CbsLeagueImportResult): NormalizedLeagueData {
  return {
    platform: "cbs",
    league: {
      id: result.league.id,
      name: result.league.name,
      season: result.league.season,
      scoringType: result.league.scoringType,
      url: result.league.url,
    },
    teams: result.teams.map((team) => ({
      id: team.id,
      name: team.name,
      manager: team.manager,
      record: team.record,
      pointsFor: team.pointsFor,
      pointsAgainst: team.pointsAgainst,
    })),
    rosters: result.rosters.map((roster) => ({
      teamId: roster.teamId,
      players: roster.players.map((player) => ({
        id: player.id,
        name: player.fullName,
        position: player.position,
        team: player.team,
        slot: player.rosterSlot,
        status: player.status,
        projectedPoints: player.projectedPoints,
        actualPoints: player.actualPoints,
        notes: player.latestNote,
      })),
    })),
    scoringRules: result.scoring.scoringRules,
    playerNotes: result.playerNotes,
    verification: { screenshots: result.screenshots ?? [] },
    raw: result.raw,
  }
}

function fallbackResult(platform: SupportedPlatform): EspnLeagueImportResult | YahooLeagueImportResult | SleeperLeagueImportResult | CbsLeagueImportResult {
  switch (platform) {
    case "espn":
      return getSampleEspnLeagueImport()
    case "yahoo":
      return getSampleYahooLeagueImport()
    case "sleeper":
      return getSampleSleeperLeagueImport()
    case "cbs":
      return getSampleCbsLeagueImport()
  }
}

function filterStrings(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value))
}

function extractSeason(source: string): number {
  const match = source.match(/season=(\d{4})/)
  return match ? Number(match[1]) : new Date().getFullYear()
}

function extractEspnLeagueId(source: string): string {
  const match = source.match(/leagues?\/(\d+)/)
  return match ? match[1] : source
}

function extractYahooLeagueKey(source: string): string {
  if (/^410\.l\./.test(source)) {
    return source
  }
  const match = source.match(/\/f1\/(\d+)/)
  return match ? `410.l.${match[1]}` : source
}

function extractSleeperLeagueId(source: string): string {
  const match = source.match(/leagues\/(\d{9})/)
  return match ? match[1] : source
}

export function normalizeSample(platform: SupportedPlatform): NormalizedLeagueData {
  return normalizeImportResult({ platform, result: fallbackResult(platform) })
}
