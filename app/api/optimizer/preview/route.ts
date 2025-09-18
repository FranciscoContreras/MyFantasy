import { NextResponse } from "next/server"

import { lineupOptimizer } from "@/lib/optimization"
import type { OptimizerInput } from "@/lib/optimization"

const sampleInput: OptimizerInput = {
  players: [
    { playerId: "qb1", name: "Josh Allen", teamId: "BUF", position: "QB", mean: 24.3, floor: 18.1, ceiling: 33.8, confidence: 92 },
    { playerId: "rb1", name: "Christian McCaffrey", teamId: "SF", position: "RB", mean: 23.5, floor: 17.2, ceiling: 32.4, confidence: 95 },
    { playerId: "rb2", name: "Bijan Robinson", teamId: "ATL", position: "RB", mean: 18.8, floor: 13.4, ceiling: 27.6, confidence: 86 },
    { playerId: "wr1", name: "Justin Jefferson", teamId: "MIN", position: "WR", mean: 21.4, floor: 15.6, ceiling: 30.9, confidence: 92 },
    { playerId: "wr2", name: "CeeDee Lamb", teamId: "DAL", position: "WR", mean: 19.1, floor: 13.5, ceiling: 27.2, confidence: 88 },
    { playerId: "wr3", name: "Chris Olave", teamId: "NO", position: "WR", mean: 17.6, floor: 12.2, ceiling: 25.1, confidence: 84 },
    { playerId: "te1", name: "Sam LaPorta", teamId: "DET", position: "TE", mean: 14.4, floor: 9.1, ceiling: 21.8, confidence: 80 },
    { playerId: "flex1", name: "Puka Nacua", teamId: "LAR", position: "WR", mean: 16.7, floor: 11.8, ceiling: 24.3, confidence: 83 },
    { playerId: "flex2", name: "Alvin Kamara", teamId: "NO", position: "RB", mean: 17.1, floor: 11.9, ceiling: 23.5, confidence: 82 },
    { playerId: "dst1", name: "Cowboys DST", teamId: "DAL", position: "DST", mean: 9.8, floor: 5.5, ceiling: 15.2, confidence: 78 },
  ],
  constraints: {
    slots: [
      { id: "QB", allowedPositions: ["QB"] },
      { id: "RB1", allowedPositions: ["RB"] },
      { id: "RB2", allowedPositions: ["RB"] },
      { id: "WR1", allowedPositions: ["WR"] },
      { id: "WR2", allowedPositions: ["WR"] },
      { id: "WR3", allowedPositions: ["WR"] },
      { id: "TE", allowedPositions: ["TE"] },
      { id: "FLEX", allowedPositions: ["RB", "WR", "TE"], flex: true },
      { id: "DST", allowedPositions: ["DST"] },
    ],
    maxPerTeam: 3,
    stackConstraints: [{ teamId: "MIN", minPlayers: 1, maxPlayers: 2 }],
  },
  options: {
    maxLineups: 3,
    riskTolerance: 0.5,
    playerExposure: {
      qb1: 2,
      rb1: 3,
    },
  },
}

export async function GET() {
  const lineups = await lineupOptimizer.optimize(sampleInput)
  return NextResponse.json({ lineups })
}
