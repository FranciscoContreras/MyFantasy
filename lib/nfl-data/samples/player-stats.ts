import type { FetchPlayerStatsParams, PlayerStat } from "@/lib/nfl-data/types"

const SAMPLE_SEASON = 2024
const SAMPLE_WEEK = 8

const SAMPLE_PLAYER_STATS: Record<string, PlayerStat> = {
  "4035687": {
    playerId: "4035687",
    name: "Justin Jefferson",
    team: "MIN",
    position: "WR",
    season: SAMPLE_SEASON,
    week: SAMPLE_WEEK,
    points: 22.4,
    stats: {
      opponent: "GB",
      targets: 12,
      receptions: 11,
      receivingYards: 146,
      receivingTouchdowns: 1,
      redZoneTargets: 3,
      fantasyPoints: 22.4,
    },
    source: "sample",
  },
  "4241478": {
    playerId: "4241478",
    name: "Puka Nacua",
    team: "LAR",
    position: "WR",
    season: SAMPLE_SEASON,
    week: SAMPLE_WEEK,
    points: 18.6,
    stats: {
      opponent: "SEA",
      targets: 10,
      receptions: 8,
      receivingYards: 118,
      receivingTouchdowns: 1,
      redZoneTargets: 2,
      fantasyPoints: 18.6,
    },
    source: "sample",
  },
  "3117257": {
    playerId: "3117257",
    name: "Christian McCaffrey",
    team: "SF",
    position: "RB",
    season: SAMPLE_SEASON,
    week: SAMPLE_WEEK,
    points: 26.3,
    stats: {
      opponent: "DAL",
      targets: 6,
      receptions: 6,
      rushingAttempts: 19,
      rushingYards: 112,
      rushingTouchdowns: 2,
      redZoneTargets: 4,
      fantasyPoints: 26.3,
    },
    source: "sample",
  },
}

function cloneForRequest(stat: PlayerStat, params: FetchPlayerStatsParams): PlayerStat {
  return {
    ...stat,
    season: params.season ?? stat.season,
    week: params.week ?? stat.week,
    stats: { ...stat.stats },
  }
}

export function getSamplePlayerStats(params: FetchPlayerStatsParams): PlayerStat[] {
  const { playerIds } = params
  if (!playerIds?.length) {
    return []
  }

  return playerIds
    .map((playerId) => SAMPLE_PLAYER_STATS[playerId])
    .filter((stat): stat is PlayerStat => Boolean(stat))
    .map((stat) => cloneForRequest(stat, params))
}
