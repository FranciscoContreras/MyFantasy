import { roundTo } from "@/lib/analysis/utils"

export interface ProjectionDistributionBucket {
  label: string
  probability: number
  floor: number
  ceiling: number
}

export interface ProjectionWeeklyPoint {
  week: string
  opponent: string
  projection: number
  floor: number
  ceiling: number
}

export interface ProjectionTargetShare {
  situation: string
  percentage: number
  delta: number
}

export interface ProjectionPlayerSummary {
  id: string
  name: string
  team: string
  position: string
  matchup: string
  mean: number
  floor: number
  ceiling: number
  volatility: number
  boomProbability: number
  bustProbability: number
  weekly: ProjectionWeeklyPoint[]
  distribution: ProjectionDistributionBucket[]
  targetShare: ProjectionTargetShare[]
}

export interface ProjectionsDashboardData {
  season: number
  week: number
  generatedAt: string
  players: ProjectionPlayerSummary[]
}

interface DistributionOptions {
  mean: number
  floor: number
  ceiling: number
}

function buildDistribution({ mean, floor, ceiling }: DistributionOptions): ProjectionDistributionBucket[] {
  const span = ceiling - floor
  const bustUpper = mean - span * 0.25
  const boomLower = mean + span * 0.25

  return [
    {
      label: "Bust",
      probability: 0.22,
      floor,
      ceiling: roundTo(bustUpper, 1),
    },
    {
      label: "Solid",
      probability: 0.48,
      floor: roundTo(bustUpper, 1),
      ceiling: roundTo(boomLower, 1),
    },
    {
      label: "Boom",
      probability: 0.3,
      floor: roundTo(boomLower, 1),
      ceiling,
    },
  ]
}

export function getSampleProjectionsDashboard(): ProjectionsDashboardData {
  const players: ProjectionPlayerSummary[] = [
    {
      id: "justin-jefferson",
      name: "Justin Jefferson",
      team: "MIN",
      position: "WR",
      matchup: "vs DET",
      mean: 21.4,
      floor: 14.2,
      ceiling: 30.1,
      volatility: 0.36,
      boomProbability: 0.34,
      bustProbability: 0.18,
      weekly: [
        { week: "W15", opponent: "vs DET", projection: 21.4, floor: 14.2, ceiling: 30.1 },
        { week: "W16", opponent: "@ GB", projection: 22.1, floor: 15.1, ceiling: 31.2 },
        { week: "W17", opponent: "vs ATL", projection: 20.4, floor: 13.5, ceiling: 28.7 },
      ],
      distribution: buildDistribution({ mean: 21.4, floor: 14.2, ceiling: 30.1 }),
      targetShare: [
        { situation: "Overall", percentage: 31, delta: 2.5 },
        { situation: "Red zone", percentage: 26, delta: 3.1 },
        { situation: "3rd down", percentage: 35, delta: 4.2 },
      ],
    },
    {
      id: "jahmyr-gibbs",
      name: "Jahmyr Gibbs",
      team: "DET",
      position: "RB",
      matchup: "@ MIN",
      mean: 17.6,
      floor: 11.9,
      ceiling: 24.8,
      volatility: 0.29,
      boomProbability: 0.27,
      bustProbability: 0.2,
      weekly: [
        { week: "W15", opponent: "@ MIN", projection: 17.6, floor: 11.9, ceiling: 24.8 },
        { week: "W16", opponent: "@ DAL", projection: 18.2, floor: 12.7, ceiling: 25.1 },
        { week: "W17", opponent: "vs CHI", projection: 16.8, floor: 11.2, ceiling: 22.9 },
      ],
      distribution: buildDistribution({ mean: 17.6, floor: 11.9, ceiling: 24.8 }),
      targetShare: [
        { situation: "Rush share", percentage: 58, delta: 4.1 },
        { situation: "Targets", percentage: 15, delta: 1.8 },
        { situation: "Inside 10", percentage: 42, delta: 5.6 },
      ],
    },
    {
      id: "cj-stroud",
      name: "C.J. Stroud",
      team: "HOU",
      position: "QB",
      matchup: "vs TEN",
      mean: 19.8,
      floor: 13.4,
      ceiling: 28.3,
      volatility: 0.33,
      boomProbability: 0.31,
      bustProbability: 0.17,
      weekly: [
        { week: "W15", opponent: "vs TEN", projection: 19.8, floor: 13.4, ceiling: 28.3 },
        { week: "W16", opponent: "@ IND", projection: 21.1, floor: 14.8, ceiling: 30.2 },
        { week: "W17", opponent: "vs JAX", projection: 20.6, floor: 13.9, ceiling: 29.4 },
      ],
      distribution: buildDistribution({ mean: 19.8, floor: 13.4, ceiling: 28.3 }),
      targetShare: [
        { situation: "Top WR", percentage: 28, delta: 2.2 },
        { situation: "RB targets", percentage: 15, delta: -1.1 },
        { situation: "TE seam", percentage: 18, delta: 1.5 },
      ],
    },
  ]

  return {
    season: 2024,
    week: 15,
    generatedAt: new Date().toISOString(),
    players,
  }
}

