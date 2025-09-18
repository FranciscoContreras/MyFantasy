import { LineupOptimizer } from "@/lib/optimization/optimizer"
import type { LineupConstraints, LineupSlot } from "@/lib/optimization/types"

describe("LineupOptimizer", () => {
  const optimizer = new LineupOptimizer()

  const slots: LineupSlot[] = [
    { id: "QB", allowedPositions: ["QB"] },
    { id: "RB1", allowedPositions: ["RB"] },
    { id: "RB2", allowedPositions: ["RB"] },
    { id: "WR1", allowedPositions: ["WR"] },
    { id: "WR2", allowedPositions: ["WR"] },
    { id: "FLEX", allowedPositions: ["RB", "WR", "TE"] },
  ]

  const constraints: LineupConstraints = {
    slots,
    salaryCap: 50000,
    maxPerTeam: 3,
  }

  const players = [
    {
      playerId: "qb-elite",
      name: "Elite QB",
      position: "QB" as const,
      teamId: "A",
      mean: 24,
      floor: 17,
      ceiling: 32,
      confidence: 90,
      salary: 9600,
    },
    {
      playerId: "rb-alpha",
      name: "Alpha RB",
      position: "RB" as const,
      teamId: "A",
      mean: 21,
      floor: 16,
      ceiling: 29,
      confidence: 85,
      salary: 8800,
    },
    {
      playerId: "rb-beta",
      name: "Beta RB",
      position: "RB" as const,
      teamId: "B",
      mean: 20,
      floor: 14,
      ceiling: 27,
      confidence: 82,
      salary: 8200,
    },
    {
      playerId: "rb-value",
      name: "Value RB",
      position: "RB" as const,
      teamId: "C",
      mean: 16,
      floor: 10,
      ceiling: 24,
      confidence: 78,
      salary: 6200,
    },
    {
      playerId: "wr-ace",
      name: "Ace WR",
      position: "WR" as const,
      teamId: "B",
      mean: 23,
      floor: 13,
      ceiling: 31,
      confidence: 88,
      salary: 8600,
    },
    {
      playerId: "wr-slatebreaker",
      name: "Slatebreaker WR",
      position: "WR" as const,
      teamId: "D",
      mean: 21,
      floor: 15,
      ceiling: 30,
      confidence: 84,
      salary: 7800,
    },
    {
      playerId: "wr-sleeper",
      name: "Sleeper WR",
      position: "WR" as const,
      teamId: "E",
      mean: 17,
      floor: 9,
      ceiling: 25,
      confidence: 72,
      salary: 5400,
    },
    {
      playerId: "te-reliable",
      name: "Reliable TE",
      position: "TE" as const,
      teamId: "F",
      mean: 14,
      floor: 8,
      ceiling: 20,
      confidence: 70,
      salary: 4200,
    },
  ]

  it("returns ranked lineups respecting constraints", async () => {
    const result = await optimizer.optimize({
      players,
      constraints,
      options: { maxLineups: 3, minMean: 100 },
    })

    expect(result).not.toHaveLength(0)

    for (const lineup of result) {
      expect(new Set(lineup.players.map((p) => p.playerId)).size).toBe(lineup.players.length)
      const totalSalary = lineup.players.reduce((sum, p) => sum + (p.salary ?? 0), 0)
      expect(totalSalary).toBeLessThanOrEqual(constraints.salaryCap ?? Infinity)
      expect(lineup.evaluation.totalMean).toBeGreaterThanOrEqual(100)
    }

    const scores = result.map((lineup) => lineup.score)
    const sortedScores = [...scores].sort((a, b) => b - a)
    expect(scores).toEqual(sortedScores)
  })

  it("limits exposure when duplicates are disallowed", async () => {
    const result = await optimizer.optimize({
      players,
      constraints,
      options: { maxLineups: 2, allowDuplicatePlayersAcrossLineups: false },
    })

    const playerUsage = new Map<string, number>()
    for (const lineup of result) {
      for (const player of lineup.players) {
        playerUsage.set(player.playerId, (playerUsage.get(player.playerId) ?? 0) + 1)
      }
    }

    expect(Array.from(playerUsage.values()).every((count) => count <= result.length)).toBe(true)
  })
})
