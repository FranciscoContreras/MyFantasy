export interface PlayerSeasonStat {
  category: string
  value: string
  rank?: number
}

export interface PlayerGameLogEntry {
  week: string
  opponent: string
  result: "W" | "L"
  points: number
  targets?: number
  touches?: number
}

export interface PlayerSplitEntry {
  label: string
  value: number
  secondary?: number
}

export interface PlayerUpcomingGame {
  week: string
  opponent: string
  venue: "home" | "away"
  matchupRating: number
  projectedPoints: number
  notes?: string
}

export interface PlayerNewsItem {
  id: string
  title: string
  summary: string
  timestamp: string
  source: string
}

export interface PlayerDashboardData {
  player: {
    id: string
    name: string
    position: string
    team: string
    avatarUrl?: string
  }
  seasonStats: PlayerSeasonStat[]
  gameLog: PlayerGameLogEntry[]
  splits: PlayerSplitEntry[]
  upcoming: PlayerUpcomingGame[]
  news: PlayerNewsItem[]
}

export function getSamplePlayerDashboard(): PlayerDashboardData {
  return {
    player: {
      id: "player-101",
      name: "Justin Jefferson",
      position: "WR",
      team: "MIN",
      avatarUrl: "https://sleepercdn.com/avatars/default23.png",
    },
    seasonStats: [
      { category: "Targets", value: "94", rank: 4 },
      { category: "Receptions", value: "68", rank: 5 },
      { category: "Yards", value: "948", rank: 6 },
      { category: "Touchdowns", value: "7", rank: 7 },
      { category: "Red-zone targets", value: "18", rank: 8 },
      { category: "Yards/route", value: "2.89" },
    ],
    gameLog: [
      { week: "W6", opponent: "@ CHI", result: "W", points: 24.4, targets: 11 },
      { week: "W7", opponent: "vs SF", result: "L", points: 18.3, targets: 9 },
      { week: "W8", opponent: "@ GB", result: "W", points: 27.6, targets: 13 },
      { week: "W9", opponent: "@ ATL", result: "W", points: 15.1, targets: 10 },
      { week: "W10", opponent: "vs NO", result: "W", points: 21.7, targets: 12 },
      { week: "W11", opponent: "@ DEN", result: "L", points: 14.5, targets: 9 },
    ],
    splits: [
      { label: "Home", value: 21.8, secondary: 18.4 },
      { label: "Away", value: 19.2, secondary: 24.1 },
      { label: "Wins", value: 23.5, secondary: 17.8 },
      { label: "Losses", value: 18.6, secondary: 21.4 },
      { label: "Vs man", value: 24.3, secondary: 19.1 },
      { label: "Vs zone", value: 18.7, secondary: 22.2 },
    ],
    upcoming: [
      {
        week: "W12",
        opponent: "@ DET",
        venue: "away",
        matchupRating: 72,
        projectedPoints: 20.4,
        notes: "Lions rank 27th vs perimeter WRs",
      },
      {
        week: "W13",
        opponent: "vs ATL",
        venue: "home",
        matchupRating: 68,
        projectedPoints: 19.1,
        notes: "Falcons allow 7.9 YPT to WR1s",
      },
      {
        week: "W14",
        opponent: "@ GB",
        venue: "away",
        matchupRating: 75,
        projectedPoints: 21.5,
        notes: "Packers missing starting corner",
      },
    ],
    news: [
      {
        id: "news-1",
        title: "Jefferson limited, trending upward",
        summary: "Jefferson logged a limited Friday session but is on track to start per Kevin O'Connell.",
        timestamp: "2024-10-12T19:10:00Z",
        source: "CBS Sports",
      },
      {
        id: "news-2",
        title: "Lions expect bracket coverage",
        summary: "Detroit coordinator Aaron Glenn confirmed additional safety help will shadow Jefferson on third downs.",
        timestamp: "2024-10-13T13:20:00Z",
        source: "Beat Report",
      },
    ],
  }
}
