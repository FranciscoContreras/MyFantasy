import { NFLDataService } from "@/lib/nfl-data"
import type { GameSchedule, PlayerStat } from "@/lib/nfl-data/types"

type DatasetSource = "live" | "fallback"

type SpotlightMetric = {
  label: string
  value: string
}

type SpotlightSeed = {
  playerId: string
  name: string
  position: string
  team: string
  fallback: {
    opponent: string
    week: number
    points: number
    targets: number
    redZoneLooks: number
    summary: string
  }
}

export interface SpotlightPlayer {
  id: string
  name: string
  position: string
  team: string
  opponent: string
  week: number | null
  season: number
  fantasyPoints: number | null
  metrics: SpotlightMetric[]
  summary: string
  source: DatasetSource
}

export interface HomeSpotlightPayload {
  season: number
  week: number | null
  updatedAt: string
  dataset: DatasetSource
  players: SpotlightPlayer[]
}

const SPOTLIGHT_SEEDS: SpotlightSeed[] = [
  {
    playerId: "4035687",
    name: "Justin Jefferson",
    position: "WR",
    team: "MIN",
    fallback: {
      opponent: "vs GB",
      week: 8,
      points: 22.4,
      targets: 12,
      redZoneLooks: 3,
      summary: "22.4 pts on 11 catches and a red-zone score vs Green Bay.",
    },
  },
  {
    playerId: "4241478",
    name: "Puka Nacua",
    position: "WR",
    team: "LAR",
    fallback: {
      opponent: "@ SEA",
      week: 8,
      points: 18.6,
      targets: 10,
      redZoneLooks: 2,
      summary: "18.6 pts with double-digit looks against Seattle's zone shells.",
    },
  },
  {
    playerId: "3117257",
    name: "Christian McCaffrey",
    position: "RB",
    team: "SF",
    fallback: {
      opponent: "vs DAL",
      week: 8,
      points: 26.3,
      targets: 6,
      redZoneLooks: 4,
      summary: "26.3 pts with two red-zone conversions against the Cowboys.",
    },
  },
]

const FALLBACK_SEASON = getLikelySeason()

const FALLBACK_SPOTLIGHT: HomeSpotlightPayload = {
  season: FALLBACK_SEASON,
  week: SPOTLIGHT_SEEDS[0]?.fallback.week ?? 1,
  updatedAt: new Date().toISOString(),
  dataset: "fallback",
  players: SPOTLIGHT_SEEDS.map((seed) => {
    const metrics: SpotlightMetric[] = [
      { label: "Fantasy points", value: `${seed.fallback.points.toFixed(1)} pts` },
      { label: "Targets", value: `${seed.fallback.targets}` },
      { label: "Red zone looks", value: `${seed.fallback.redZoneLooks}` },
    ]

    return {
      id: seed.playerId,
      name: seed.name,
      position: seed.position,
      team: seed.team,
      opponent: seed.fallback.opponent,
      week: seed.fallback.week,
      season: FALLBACK_SEASON,
      fantasyPoints: seed.fallback.points,
      metrics,
      summary: seed.fallback.summary,
      source: "fallback",
    }
  }),
}

export async function getHomeSpotlight(): Promise<HomeSpotlightPayload> {
  const service = new NFLDataService()
  const season = getLikelySeason()

  try {
    let schedule = await service.fetchSchedule(
      { season },
      { requestId: "landing:schedule", ttlMs: 15 * 60 * 1000 },
    )

    let latestWeek = extractLatestCompletedWeek(schedule)

    if (!latestWeek) {
      const currentWeek = schedule[0]?.week
      if (currentWeek && currentWeek > 1) {
        schedule = await service.fetchSchedule(
          { season, week: currentWeek - 1 },
          { requestId: "landing:schedule:previous", ttlMs: 15 * 60 * 1000 },
        )
        latestWeek = extractLatestCompletedWeek(schedule) ?? currentWeek - 1
      }
    }

    if (!latestWeek && schedule[0]?.week) {
      latestWeek = schedule[0]?.week
    }

    const playerStats = await service.fetchPlayerStats(
      { season, week: latestWeek, playerIds: SPOTLIGHT_SEEDS.map((seed) => seed.playerId) },
      { requestId: "landing:player-stats", ttlMs: 10 * 60 * 1000 },
    )

    const players = SPOTLIGHT_SEEDS.map((seed) =>
      mapPlayerStatToSpotlight(seed, playerStats.find((stat) => stat.playerId === seed.playerId), season, latestWeek),
    )

    const resolvedWeek = determineWeek(players, latestWeek)

    if (players.every((player) => player.source === "fallback")) {
      return FALLBACK_SPOTLIGHT
    }

    return {
      season,
      week: resolvedWeek,
      updatedAt: new Date().toISOString(),
      dataset: "live",
      players,
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.warn("[getHomeSpotlight] Falling back to static payload", error)
    }
    return FALLBACK_SPOTLIGHT
  }
}

function mapPlayerStatToSpotlight(
  seed: SpotlightSeed,
  stat: PlayerStat | undefined,
  season: number,
  latestWeek?: number,
): SpotlightPlayer {
  if (!stat) {
    return FALLBACK_SPOTLIGHT.players.find((player) => player.id === seed.playerId) ?? {
      id: seed.playerId,
      name: seed.name,
      position: seed.position,
      team: seed.team,
      opponent: seed.fallback.opponent,
      week: seed.fallback.week,
      season,
      fantasyPoints: seed.fallback.points,
      metrics: [
        { label: "Fantasy points", value: `${seed.fallback.points.toFixed(1)} pts` },
        { label: "Targets", value: `${seed.fallback.targets}` },
        { label: "Red zone looks", value: `${seed.fallback.redZoneLooks}` },
      ],
      summary: seed.fallback.summary,
      source: "fallback",
    }
  }

  const points = toNumber(stat.points) ?? seed.fallback.points
  const opponent = extractOpponent(stat) ?? seed.fallback.opponent
  const targets = toNumber(stat.stats?.targets ?? stat.stats?.receptions) ?? seed.fallback.targets
  const redZone = toNumber(stat.stats?.redZoneTargets ?? stat.stats?.redzoneLooks) ?? seed.fallback.redZoneLooks
  const week = stat.week ?? latestWeek ?? seed.fallback.week

  const metrics: SpotlightMetric[] = [
    { label: "Fantasy points", value: `${points.toFixed(1)} pts` },
    { label: "Targets", value: targets !== null ? `${targets}` : "—" },
    { label: "Red zone looks", value: redZone !== null ? `${redZone}` : "—" },
  ]

  const summary = buildSummary(seed.name, week, opponent, points, targets)

  return {
    id: seed.playerId,
    name: seed.name,
    position: seed.position,
    team: seed.team,
    opponent,
    week,
    season,
    fantasyPoints: points,
    metrics,
    summary,
    source: "live",
  }
}

function determineWeek(players: SpotlightPlayer[], latestWeek?: number | null): number | null {
  if (latestWeek) return latestWeek
  const fromPlayers = players
    .map((player) => player.week)
    .filter((value): value is number => typeof value === "number" && !Number.isNaN(value))
  return fromPlayers.length ? Math.max(...fromPlayers) : null
}

function extractLatestCompletedWeek(schedule: GameSchedule[]): number | undefined {
  const completed = schedule.filter((game) => game.completed)
  if (!completed.length) {
    return undefined
  }
  return completed.reduce((max, game) => (game.week > max ? game.week : max), 0)
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function extractOpponent(stat: PlayerStat): string | null {
  const possibleKeys = ["opponent", "opponentAbbr", "opponentShort", "opp", "opponentTeam"]
  for (const key of possibleKeys) {
    const raw = stat.stats?.[key]
    if (typeof raw === "string" && raw.trim().length > 0) {
      return normalizeOpponent(raw)
    }
  }
  return null
}

function normalizeOpponent(value: string): string {
  const cleaned = value.trim()
  if (/^vs|@/.test(cleaned)) {
    return cleaned
  }
  return cleaned.length <= 4 ? `vs ${cleaned.toUpperCase()}` : cleaned
}

function buildSummary(name: string, week: number | null, opponent: string, points: number, targets: number | null): string {
  const weekLabel = week ? `Week ${week}` : "latest week"
  const targetFragment = targets !== null ? `${targets} looks` : "impact touches"
  return `${name} posted ${points.toFixed(1)} fantasy points on ${targetFragment} ${weekLabel} ${opponent}.`
}

function getLikelySeason(): number {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  // NFL regular season spans Sept-Jan. Assume new season starts in March for schedule building.
  return month < 3 ? year - 1 : year
}
