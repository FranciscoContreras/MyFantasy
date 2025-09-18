import type { EspnLeagueImportResult } from "@/lib/league-importers/espn/types"

export function getSampleEspnLeagueImport(): EspnLeagueImportResult {
  return {
    fetchedAt: new Date().toISOString(),
    league: {
      id: "123456",
      name: "Bay Area Legends League",
      season: 2024,
      scoringPeriodId: 12,
      currentMatchupPeriod: 14,
      scoringType: "H2H",
      draftType: "snake",
      playoffSeedings: [
        { seed: 1, teamId: "1" },
        { seed: 2, teamId: "4" },
        { seed: 3, teamId: "2" },
        { seed: 4, teamId: "6" },
      ],
    },
    teams: [
      {
        id: "1",
        name: "Bay Area Legends",
        abbreviation: "BAL",
        owner: { displayName: "Alex" },
        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
        record: { wins: 8, losses: 5, ties: 0 },
        projectedRank: 1,
      },
      {
        id: "2",
        name: "Pacifica Waves",
        abbreviation: "PAC",
        owner: { displayName: "Priya" },
        logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
        record: { wins: 6, losses: 7, ties: 0 },
        projectedRank: 4,
      },
    ],
    rosters: [
      {
        teamId: "1",
        players: [
          {
            id: "2606308",
            fullName: "Justin Jefferson",
            position: "WR",
            proTeam: "MIN",
            lineupSlot: "WR",
            injuryStatus: "QUESTIONABLE",
            obtainedVia: "DRAFT",
            projectedPoints: 21.4,
            actualPoints: 0,
            percentOwned: 99.2,
          },
          {
            id: "2971953",
            fullName: "Christian McCaffrey",
            position: "RB",
            proTeam: "SF",
            lineupSlot: "RB",
            projectedPoints: 24.9,
            actualPoints: 0,
            percentOwned: 99.9,
          },
        ],
      },
      {
        teamId: "2",
        players: [
          {
            id: "4047365",
            fullName: "Amon-Ra St. Brown",
            position: "WR",
            proTeam: "DET",
            lineupSlot: "WR",
            projectedPoints: 19.1,
            actualPoints: 0,
            percentOwned: 98.6,
          },
        ],
      },
    ],
    scoring: {
      categories: [
        { categoryId: 0, statName: "Passing Yards", points: 0.04 },
        { categoryId: 1, statName: "Passing Touchdowns", points: 4 },
        { categoryId: 2, statName: "Receptions", points: 1 },
      ],
      rosterSlots: [
        { slot: "QB", count: 1 },
        { slot: "RB", count: 2 },
        { slot: "WR", count: 2 },
        { slot: "FLEX", count: 2 },
        { slot: "DST", count: 1 },
      ],
      acquisitionLimits: {
        tradeDeadline: "2024-11-20T18:00:00Z",
        totalMoves: 40,
        faabBudget: 100,
      },
    },
    transactions: [
      {
        id: "9001",
        type: "Trade",
        executedAt: "2024-10-12T18:34:00Z",
        details: "Bay Area Legends acquired Jahmyr Gibbs, Pacifica Waves acquired Justin Jefferson",
        teamsInvolved: ["1", "2"],
      },
      {
        id: "9002",
        type: "Waiver",
        executedAt: "2024-10-13T12:00:00Z",
        details: "Pacifica Waves added Tank Dell",
        teamsInvolved: ["2"],
      },
    ],
    standings: [
      { teamId: "1", wins: 8, losses: 5, ties: 0, winPct: 0.615, pointsFor: 1421.3, streak: "W2" },
      { teamId: "2", wins: 6, losses: 7, ties: 0, winPct: 0.462, pointsFor: 1334.9, streak: "L1" },
    ],
    raw: {
      source: "sample",
    },
  }
}
