export interface SeasonTrendPoint {
  week: string
  projected: number
  actual: number
}

export interface PointsDistributionBin {
  range: string
  games: number
}

export interface MatchupHistoryEntry {
  week: string
  opponent: string
  result: "W" | "L"
  pointsFor: number
  pointsAgainst: number
}

export interface PositionPerformanceEntry {
  position: string
  projected: number
  actual: number
}

export interface TeamRadarMetric {
  metric: string
  you: number
  opponent: number
}

export interface PerformanceDashboardData {
  seasonTrends: SeasonTrendPoint[]
  pointsDistribution: PointsDistributionBin[]
  matchupHistory: MatchupHistoryEntry[]
  positionPerformance: PositionPerformanceEntry[]
  teamRadar: TeamRadarMetric[]
}

export function getSamplePerformanceDashboard(): PerformanceDashboardData {
  return {
    seasonTrends: [
      { week: "W1", projected: 118.4, actual: 124.6 },
      { week: "W2", projected: 121.2, actual: 117.9 },
      { week: "W3", projected: 125.5, actual: 131.4 },
      { week: "W4", projected: 119.8, actual: 109.2 },
      { week: "W5", projected: 128.1, actual: 142.3 },
      { week: "W6", projected: 130.4, actual: 137.2 },
      { week: "W7", projected: 127.9, actual: 133.8 },
      { week: "W8", projected: 129.6, actual: 122.5 },
      { week: "W9", projected: 132.2, actual: 135.1 },
      { week: "W10", projected: 133.8, actual: 138.6 },
    ],
    pointsDistribution: [
      { range: "80-90", games: 1 },
      { range: "90-100", games: 2 },
      { range: "100-110", games: 1 },
      { range: "110-120", games: 2 },
      { range: "120-130", games: 2 },
      { range: "130-140", games: 1 },
      { range: "140-150", games: 1 },
    ],
    matchupHistory: [
      { week: "W1", opponent: "Seaside Sharks", result: "W", pointsFor: 124.6, pointsAgainst: 118.3 },
      { week: "W2", opponent: "Hilltop Hawks", result: "L", pointsFor: 117.9, pointsAgainst: 121.4 },
      { week: "W3", opponent: "Marina Mavericks", result: "W", pointsFor: 131.4, pointsAgainst: 109.8 },
      { week: "W4", opponent: "Ridge Raiders", result: "L", pointsFor: 109.2, pointsAgainst: 129.5 },
      { week: "W5", opponent: "Downtown Dynamos", result: "W", pointsFor: 142.3, pointsAgainst: 121.7 },
      { week: "W6", opponent: "Coastline Crushers", result: "W", pointsFor: 137.2, pointsAgainst: 130.1 },
    ],
    positionPerformance: [
      { position: "QB", projected: 22.5, actual: 24.1 },
      { position: "RB", projected: 39.4, actual: 42.8 },
      { position: "WR", projected: 45.2, actual: 48.7 },
      { position: "TE", projected: 11.6, actual: 9.3 },
      { position: "FLEX", projected: 18.3, actual: 16.9 },
      { position: "DST", projected: 7.2, actual: 8.6 },
      { position: "K", projected: 8.1, actual: 7.4 },
    ],
    teamRadar: [
      { metric: "Efficiency", you: 78, opponent: 71 },
      { metric: "Ceiling", you: 82, opponent: 75 },
      { metric: "Floor", you: 68, opponent: 65 },
      { metric: "Consistency", you: 74, opponent: 69 },
      { metric: "Matchup", you: 80, opponent: 72 },
    ],
  }
}
