import type { CbsLeagueImportResult } from "@/lib/league-importers/cbs/types"

export function getSampleCbsLeagueImport(): CbsLeagueImportResult {
  return {
    fetchedAt: new Date().toISOString(),
    league: {
      id: "nfl2024_cbs_12345",
      name: "Pacific Coast Premier League",
      season: 2024,
      sport: "nfl",
      scoringType: "PPR",
      commissioner: "Jamie",
      url: "https://www.cbssports.com/fantasy/football/league/pacific-premier",
    },
    teams: [
      {
        id: "team-1",
        name: "Golden Gate Guardians",
        manager: "Alex",
        division: "West",
        record: { wins: 8, losses: 5, ties: 0 },
        pointsFor: 1389.6,
        pointsAgainst: 1272.4,
      },
      {
        id: "team-2",
        name: "Seaside Sharks",
        manager: "Priya",
        division: "East",
        record: { wins: 7, losses: 6, ties: 0 },
        pointsFor: 1344.8,
        pointsAgainst: 1299.3,
      },
    ],
    rosters: [
      {
        teamId: "team-1",
        players: [
          {
            id: "player-101",
            fullName: "Justin Jefferson",
            position: "WR",
            team: "MIN",
            rosterSlot: "WR",
            projectedPoints: 21.5,
            actualPoints: 0,
            latestNote: "Questionable after limited practice Friday.",
          },
          {
            id: "player-102",
            fullName: "Christian McCaffrey",
            position: "RB",
            team: "SF",
            rosterSlot: "RB",
            projectedPoints: 24.9,
            actualPoints: 0,
            latestNote: "Expected full workload per team reporter.",
          },
        ],
      },
      {
        teamId: "team-2",
        players: [
          {
            id: "player-150",
            fullName: "Tyreek Hill",
            position: "WR",
            team: "MIA",
            rosterSlot: "WR",
            projectedPoints: 23.3,
            actualPoints: 0,
            latestNote: "Facing windy conditions; still WR1.",
          },
        ],
      },
    ],
    scoring: {
      rosterSlots: [
        { slot: "QB", count: 1 },
        { slot: "RB", count: 2 },
        { slot: "WR", count: 2 },
        { slot: "TE", count: 1 },
        { slot: "FLEX", count: 2 },
        { slot: "K", count: 1 },
        { slot: "DST", count: 1 },
      ],
      scoringRules: [
        { category: "Passing Yards", value: 0.04, description: "0.04 pts per passing yard" },
        { category: "Passing TD", value: 4, description: "4 pts per passing TD" },
        { category: "Reception", value: 1, description: "1 pt per reception" },
        { category: "Rushing Yards", value: 0.1, description: "0.1 pts per rushing yard" },
      ],
    },
    playerNotes: [
      {
        playerId: "player-101",
        title: "Jefferson logs limited session",
        content: "Jefferson returned to practice Friday and is trending toward playing Sunday night.",
        timestamp: "2024-10-11T19:45:00Z",
        source: "CBS Sports Staff",
      },
      {
        playerId: "player-150",
        title: "Hill facing gusty conditions",
        content: "Forecast calls for 20 mph winds in Kansas City, but Hill remains a must-start.",
        timestamp: "2024-10-12T14:10:00Z",
        source: "CBS Weather Center",
      },
    ],
    screenshots: [
      "./tmp/screenshots/cbs-league-dashboard.png",
      "./tmp/screenshots/cbs-player-notes.png",
    ],
    raw: {
      source: "sample",
    },
  }
}
