import type { SleeperLeagueImportResult } from "@/lib/league-importers/sleeper/types"

export function getSampleSleeperLeagueImport(): SleeperLeagueImportResult {
  return {
    fetchedAt: new Date().toISOString(),
    league: {
      id: "987654321",
      name: "Bay Area Dynasty",
      season: 2024,
      sport: "nfl",
      seasonType: "regular",
      scoringType: "half_ppr",
      avatarUrl: "https://sleepercdn.com/avatars/default23.png",
      status: "in_progress",
    },
    users: [
      { userId: "user123", displayName: "Alex", avatarUrl: "https://sleepercdn.com/avatars/default1.png" },
      { userId: "user456", displayName: "Priya", avatarUrl: "https://sleepercdn.com/avatars/default2.png" },
    ],
    rosters: [
      {
        rosterId: 1,
        ownerId: "user123",
        starters: ["QB123", "RB456", "WR789"],
        reserves: ["WR111", "TE222"],
        taxi: [],
        players: ["QB123", "RB456", "WR789", "WR111", "TE222"],
      },
      {
        rosterId: 2,
        ownerId: "user456",
        starters: ["QB555", "RB777", "WR888"],
        reserves: ["WR444", "TE666"],
        taxi: ["RB999"],
        players: ["QB555", "RB777", "WR888", "WR444", "TE666", "RB999"],
      },
    ],
    players: [
      { playerId: "QB123", fullName: "Patrick Mahomes", position: "QB", team: "KC", age: 29 },
      { playerId: "RB456", fullName: "Christian McCaffrey", position: "RB", team: "SF", status: "active" },
      { playerId: "WR789", fullName: "Justin Jefferson", position: "WR", team: "MIN", status: "questionable" },
    ],
    settings: {
      rosterPositions: ["QB", "RB", "RB", "WR", "WR", "TE", "FLEX", "FLEX", "Bench", "Bench", "Bench"],
      benchCount: 3,
      taxiCount: 1,
      scoringRules: [
        { stat: "pass_yd", value: 0.04, description: "Passing Yards" },
        { stat: "rec", value: 0.5, description: "Reception" },
        { stat: "rush_td", value: 6, description: "Rushing TD" },
      ],
    },
    transactions: [
      {
        id: "txn_9001",
        type: "trade",
        status: "processed",
        executedAt: "2024-10-11T16:42:00Z",
        adds: { user456: "RB777" },
        drops: { user123: "WR789" },
      },
      {
        id: "txn_9002",
        type: "waiver",
        status: "processed",
        executedAt: "2024-10-12T12:00:00Z",
        adds: { user123: "TE222" },
        drops: { user123: "WR111" },
      },
    ],
    chat: [
      {
        id: "chat_5001",
        authorId: "user123",
        authorName: "Alex",
        message: "Trade on the table: Jefferson for Gibbs?",
        createdAt: "2024-10-10T21:15:00Z",
      },
      {
        id: "chat_5002",
        authorId: "user456",
        authorName: "Priya",
        message: "Need a QB streamer, any offers?",
        createdAt: "2024-10-12T04:30:00Z",
      },
    ],
    screenshots: [
      "./tmp/screenshots/sleeper-league-settings.png",
      "./tmp/screenshots/sleeper-league-chat.png",
    ],
    raw: {
      source: "sample",
    },
  }
}
