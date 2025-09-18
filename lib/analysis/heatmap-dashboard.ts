export interface HeatmapCell {
  row: string
  column: string
  value: number
  note?: string
}

export interface HeatmapDataSet {
  title: string
  rows: string[]
  columns: string[]
  values: HeatmapCell[]
}

export interface HeatmapDashboardData {
  matchupDifficulty: HeatmapDataSet
  positionStrength: HeatmapDataSet
  weeklyProjections: HeatmapDataSet
  tradeValues: HeatmapDataSet
}

function buildMatrix(rows: string[], columns: string[], generator: (row: string, column: string) => HeatmapCell): HeatmapDataSet['values'] {
  const values: HeatmapCell[] = []
  for (const row of rows) {
    for (const column of columns) {
      values.push(generator(row, column))
    }
  }
  return values
}

export function getSampleHeatmapDashboard(): HeatmapDashboardData {
  const teams = ["SEA", "DET", "KC", "PHI", "DAL", "BUF", "CIN"]
  const positions = ["QB", "RB", "WR", "TE", "FLEX"]
  const weeks = ["W12", "W13", "W14", "W15", "W16"]
  const tradeMetrics = ["Value", "ROS", "Playoff", "Volatility"]
  const tradeTargets = ["Justin Jefferson", "Christian McCaffrey", "Amon-Ra St. Brown", "Tyreek Hill"]

  return {
    matchupDifficulty: {
      title: "Matchup difficulty",
      rows: teams,
      columns: positions,
      values: buildMatrix(teams, positions, (team, position) => ({
        row: team,
        column: position,
        value: Math.round(Math.random() * 60 + 20),
        note: `${team} vs ${position} rank ${Math.floor(Math.random() * 32) + 1}`,
      })),
    },
    positionStrength: {
      title: "Position strength",
      rows: positions,
      columns: ["Usage", "Efficiency", "Explosive", "Red zone", "Consistency"],
      values: buildMatrix(positions, ["Usage", "Efficiency", "Explosive", "Red zone", "Consistency"], (position, metric) => ({
        row: position,
        column: metric,
        value: Math.round(Math.random() * 40 + 30),
      })),
    },
    weeklyProjections: {
      title: "Weekly projections",
      rows: weeks,
      columns: positions,
      values: buildMatrix(weeks, positions, (week, position) => ({
        row: week,
        column: position,
        value: Math.round(Math.random() * 15 + 10),
        note: `${week} ${position} projection`,
      })),
    },
    tradeValues: {
      title: "Trade values",
      rows: tradeTargets,
      columns: tradeMetrics,
      values: buildMatrix(tradeTargets, tradeMetrics, (player, metric) => ({
        row: player,
        column: metric,
        value: Math.round(Math.random() * 50 + 50),
      })),
    },
  }
}
