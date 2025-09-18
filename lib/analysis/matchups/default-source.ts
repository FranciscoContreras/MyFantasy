import { nflDataService } from "@/lib/nfl-data"
import { findSchemeSnapshot } from "@/lib/nfl-data/scheme-intel"
import type {
  MatchupAnalysisRequest,
  MatchupDataSource,
  HistoricalMatchupSample,
  PositionalDefenseMetric,
  SchemeIntel,
  GameScriptData,
} from "@/lib/analysis/matchups/types"

export class DefaultMatchupDataSource implements MatchupDataSource {
  async fetchPlayerMatchupSamples(request: MatchupAnalysisRequest): Promise<HistoricalMatchupSample[]> {
    const context = {
      requestId: `matchup-samples:${request.playerId}`,
      reason: request.context?.forceRefresh ? "refresh" : undefined,
      ttlMs: 10 * 60 * 1000,
    }

    const pastSeasons = await Promise.all(
      [request.season - 1, request.season - 2].map((season) =>
        nflDataService
          .fetchPlayerStats({ season, playerIds: [request.playerId] }, context)
          .catch(() => []),
      ),
    )

    const flattened = pastSeasons.flat()

    return flattened
      .filter((entry) => typeof entry.points === "number")
      .map((entry) => ({
        season: entry.season,
        week: entry.week ?? 0,
        points: entry.points ?? 0,
      }))
  }

  async fetchPositionalDefenseMetrics(position: string, season: number, week: number): Promise<PositionalDefenseMetric[]> {
    const context = {
      requestId: `defense-metrics:${position}:${season}:${week}`,
      ttlMs: 15 * 60 * 1000,
    }

    const defenseStats = await nflDataService.fetchTeamDefense({ season, week }, context)

    return defenseStats.map((entry) => ({
      teamId: entry.teamId,
      position,
      rank: entry.rank ?? 16,
      pointsAllowed: entry.pointsAllowed ?? 23,
      yardsAllowed: entry.yardsAllowed,
      explosiveRate: entry.turnovers ? entry.turnovers / 10 : undefined,
    }))
  }

  async fetchSchemeIntel(teamIds: string[]): Promise<SchemeIntel[]> {
    return teamIds.map((teamId) => {
      const snapshot = findSchemeSnapshot(teamId)
      if (!snapshot) {
        return {
          teamId,
          blitzRate: undefined,
          pressureRate: undefined,
          notes: "Scheme data unavailable yet",
        }
      }
      return {
        teamId,
        blitzRate: snapshot.blitzRate,
        pressureRate: snapshot.pressureRate,
        manCoverageRate: snapshot.manCoverageRate,
        zoneCoverageRate: snapshot.zoneCoverageRate,
        notes: snapshot.notes,
      }
    })
  }

  async fetchGameScriptData(teamIds: string[], season: number, week: number): Promise<GameScriptData[]> {
    const context = {
      requestId: `game-script:${season}:${week}`,
      ttlMs: 5 * 60 * 1000,
    }

    const schedule = await nflDataService.fetchSchedule({ season, week }, context)

    return teamIds.map((teamId) => {
      const game = schedule.find((item) => item.homeTeamId === teamId || item.awayTeamId === teamId)
      return {
        teamId,
        pace: game ? 27 : undefined,
        passRate: game ? 0.55 : undefined,
        neutralPassRate: 0.5,
        projectedMargin: game ? (game.homeTeamId === teamId ? -3 : 3) : undefined,
        playsPerGame: 63,
      }
    })
  }
}

export const defaultMatchupDataSource = new DefaultMatchupDataSource()
