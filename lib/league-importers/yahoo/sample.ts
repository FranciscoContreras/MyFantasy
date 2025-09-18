import type { YahooLeagueImportResult, YahooMultiLeagueResult } from "@/lib/league-importers/yahoo/types"

export function getSampleYahooLeagueImport(): YahooLeagueImportResult {
  return {
    fetchedAt: new Date().toISOString(),
    league: {
      id: "410.l.98765",
      name: "West Coast Warriors",
      season: 2024,
      sport: "nfl",
      scoringType: "head",
      currentWeek: 14,
      totalWeeks: 17,
      url: "https://football.fantasysports.yahoo.com/f1/98765",
    },
    teams: [
      {
        id: "410.l.98765.t.1",
        name: "Golden Gate Goats",
        manager: { nickname: "Sasha", email: "sasha@example.com" },
        logoUrl: "https://s.yimg.com/cv/apiv2/default/mlb/2022/20.png",
        record: { wins: 9, losses: 4, ties: 0, winPct: 0.692 },
        pointsFor: 1398.4,
        pointsAgainst: 1230.7,
        streak: "W3",
      },
      {
        id: "410.l.98765.t.5",
        name: "Marina Mavericks",
        manager: { nickname: "Dev" },
        logoUrl: "https://s.yimg.com/cv/apiv2/default/nfl/2023/8.png",
        record: { wins: 7, losses: 6, ties: 0, winPct: 0.538 },
        pointsFor: 1312.6,
        pointsAgainst: 1288.3,
        streak: "L1",
      },
    ],
    rosters: [
      {
        teamId: "410.l.98765.t.1",
        players: [
          {
            id: "nfl.p.32649",
            fullName: "Christian McCaffrey",
            position: "RB",
            team: "SF",
            status: "P",
            rosterSlot: "RB",
            projectedPoints: 22.8,
            actualPoints: 0,
          },
          {
            id: "nfl.p.32688",
            fullName: "A.J. Brown",
            position: "WR",
            team: "PHI",
            status: "P",
            rosterSlot: "WR",
            projectedPoints: 19.7,
            actualPoints: 0,
          },
        ],
      },
      {
        teamId: "410.l.98765.t.5",
        players: [
          {
            id: "nfl.p.33115",
            fullName: "Jahmyr Gibbs",
            position: "RB",
            team: "DET",
            status: "P",
            rosterSlot: "RB",
            projectedPoints: 17.1,
            actualPoints: 0,
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
        { slot: "DEF", count: 1 },
      ],
      scoringRules: [
        { category: "pass_yds", value: 0.04, description: "Passing Yards" },
        { category: "pass_td", value: 4, description: "Passing TD" },
        { category: "rec", value: 0.5, description: "Reception" },
      ],
    },
    transactions: [
      {
        id: "410.l.98765.tr.512",
        type: "trade",
        executedAt: "2024-10-18T06:45:00Z",
        summary: "Golden Gate Goats traded Tee Higgins to Marina Mavericks for Rhamondre Stevenson",
        teamsInvolved: ["410.l.98765.t.1", "410.l.98765.t.5"],
      },
      {
        id: "410.l.98765.tr.519",
        type: "add",
        executedAt: "2024-10-19T14:02:00Z",
        summary: "Marina Mavericks added Tank Dell",
        teamsInvolved: ["410.l.98765.t.5"],
      },
    ],
    liveScores: [
      {
        teamId: "410.l.98765.t.1",
        opponentTeamId: "410.l.98765.t.5",
        teamPoints: 85.3,
        opponentPoints: 79.6,
        matchupStatus: "live",
        updatedAt: new Date().toISOString(),
      },
    ],
    raw: {
      sample: true,
    },
  }
}

export function getSampleYahooMultiLeague(): YahooMultiLeagueResult {
  return {
    fetchedAt: new Date().toISOString(),
    leagues: [
      {
        league: {
          id: "410.l.98765",
          name: "West Coast Warriors",
          season: 2024,
          sport: "nfl",
          scoringType: "head",
          currentWeek: 14,
          totalWeeks: 17,
          url: "https://football.fantasysports.yahoo.com/f1/98765",
        },
        teams: [
          {
            id: "410.l.98765.t.1",
            name: "Golden Gate Goats",
            manager: { nickname: "Sasha" },
            pointsFor: 1398.4,
            pointsAgainst: 1230.7,
            record: { wins: 9, losses: 4, ties: 0, winPct: 0.692 },
            streak: "W3",
          },
        ],
        link: "https://football.fantasysports.yahoo.com/f1/98765",
      },
      {
        league: {
          id: "410.l.55555",
          name: "Pacifica Dynasty",
          season: 2024,
          sport: "nfl",
          scoringType: "points",
          currentWeek: 14,
          totalWeeks: 17,
          url: "https://football.fantasysports.yahoo.com/f1/55555",
        },
        teams: [],
        link: "https://football.fantasysports.yahoo.com/f1/55555",
      },
    ],
  }
}
