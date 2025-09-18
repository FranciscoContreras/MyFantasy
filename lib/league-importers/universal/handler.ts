import { getSampleCbsLeagueImport } from "@/lib/league-importers/cbs/sample"
import type { CbsLeagueImportResult } from "@/lib/league-importers/cbs/types"
import { getSampleEspnLeagueImport } from "@/lib/league-importers/espn/sample"
import type { EspnLeagueImportResult } from "@/lib/league-importers/espn/types"
import { getSampleSleeperLeagueImport } from "@/lib/league-importers/sleeper/sample"
import type { SleeperLeagueImportResult } from "@/lib/league-importers/sleeper/types"
import { getSampleYahooLeagueImport } from "@/lib/league-importers/yahoo/sample"
import type { YahooLeagueImportResult } from "@/lib/league-importers/yahoo/types"
import { detectPlatform } from "@/lib/league-importers/universal/detect"
import type {
  NormalizedLeagueData,
  UniversalImportOptions,
  SupportedPlatform,
  PlatformImportResult,
} from "@/lib/league-importers/universal/types"

export async function runUniversalImport(options: UniversalImportOptions): Promise<NormalizedLeagueData> {
  const detection = options.platform
    ? { platform: options.platform, confidence: 1, details: "Provided by caller" }
    : detectPlatform(options.source)

  const platform = detection.platform
  options.onProgress?.({ platform, step: "detect", message: detection.details, progress: 0.1 })
  options.onProgress?.({ platform, step: "normalize", message: "Using cached sample data", progress: 0.6 })
  const normalized = normalizeSample(platform)
  options.onProgress?.({ platform, step: "complete", message: "Import completed (sample)", progress: 1 })
  return normalized
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
        team: player.proTeam,
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

export function normalizeSample(platform: SupportedPlatform): NormalizedLeagueData {
  return normalizeImportResult({ platform, result: fallbackResult(platform) })
}
