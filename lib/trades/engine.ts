import { clamp } from "@/lib/analysis/utils"
import type { TradeAnalyzerInput, TradeAnalysisResult, TradeFairness, TradeImpactSummary, TradePackage, TradeRecommendation, TradeValueBreakdown } from "@/lib/trades/types"

interface PackageValue {
  outgoing: TradeValueBreakdown
  incoming: TradeValueBreakdown
  net: number
  impact: TradeImpactSummary
}

export class TradeAnalyzer {
  analyze(input: TradeAnalyzerInput): TradeAnalysisResult {
    const teamAValue = this.evaluatePackage(input.teamA, input.totalWeeks, input.week)
    const teamBValue = this.evaluatePackage(input.teamB, input.totalWeeks, input.week)

    const fairness = this.computeFairness(teamAValue.net, teamBValue.net)
    const recommendation = this.buildRecommendation(teamAValue, teamBValue, fairness)

    return {
      season: input.season,
      week: input.week,
      teamA: teamAValue,
      teamB: teamBValue,
      fairness,
      recommendation,
      generatedAt: new Date().toISOString(),
    }
  }

  private evaluatePackage(trade: TradePackage, totalWeeks: number, currentWeek: number): PackageValue {
    const gamesRemaining = Math.max(totalWeeks - currentWeek + 1, 1)

    const outgoing = this.calculateValue(trade.playersSent, gamesRemaining)
    const incoming = this.calculateValue(trade.playersReceived, gamesRemaining)
    const net = incoming.total - outgoing.total

    const rosterNotes = this.buildRosterNotes(trade.playersSent, trade.playersReceived)
    const weeklyPointDelta = incoming.perGame - outgoing.perGame
    const recordDelta = weeklyPointDelta * 0.08 // heuristic: 0.08 wins per point delta per game
    const playoffDelta = weeklyPointDelta * 0.015 + (net > 0 ? 0.02 : -0.02)

    const impact: TradeImpactSummary = {
      projectedRecordDelta: Number(recordDelta.toFixed(2)),
      playoffProbabilityDelta: Number(playoffDelta.toFixed(3)),
      weeklyPointDelta: Number(weeklyPointDelta.toFixed(2)),
      rosterBalanceNotes: rosterNotes,
    }

    return { outgoing, incoming, net, impact }
  }

  private calculateValue(players: TradePackage["playersSent"], gamesRemaining: number): TradeValueBreakdown {
    if (!players.length) {
      return {
        total: 0,
        perGame: 0,
        floor: 0,
        ceiling: 0,
        riskAdjustment: 0,
        scheduleAdjustment: 0,
      }
    }

    let total = 0
    let perGame = 0
    let floor = 0
    let ceiling = 0
    let riskAggregate = 0
    let scheduleAggregate = 0

    for (const player of players) {
      const projection = player.restOfSeasonProjection
      const risk = clamp(1 - (player.injuryRisk ?? 0.25))
      const schedule = clamp(player.scheduleDifficulty ?? 0.5)

      const adjProjection = projection * (0.9 + schedule * 0.2) * risk
      perGame += adjProjection
      total += adjProjection * gamesRemaining

      floor += adjProjection * 0.8 * risk
      ceiling += adjProjection * (1.15 + schedule * 0.1)

      riskAggregate += risk
      scheduleAggregate += schedule
    }

    const count = players.length
    return {
      total: Number(total.toFixed(1)),
      perGame: Number((perGame / count).toFixed(2)),
      floor: Number((floor / count).toFixed(2)),
      ceiling: Number((ceiling / count).toFixed(2)),
      riskAdjustment: Number((riskAggregate / count).toFixed(2)),
      scheduleAdjustment: Number((scheduleAggregate / count).toFixed(2)),
    }
  }

  private buildRosterNotes(outgoing: TradePackage["playersSent"], incoming: TradePackage["playersReceived"]): string[] {
    const outgoingPositions = outgoing.reduce<Record<string, number>>((acc, player) => {
      acc[player.position] = (acc[player.position] ?? 0) + 1
      return acc
    }, {})

    const incomingPositions = incoming.reduce<Record<string, number>>((acc, player) => {
      acc[player.position] = (acc[player.position] ?? 0) + 1
      return acc
    }, {})

    const notes: string[] = []

    for (const [position, outgoingCount] of Object.entries(outgoingPositions)) {
      const incomingCount = incomingPositions[position] ?? 0
      if (incomingCount < outgoingCount) {
        notes.push(`Depth loss at ${position}: -${outgoingCount - incomingCount}`)
      }
    }

    for (const [position, incomingCount] of Object.entries(incomingPositions)) {
      const outgoingCount = outgoingPositions[position] ?? 0
      if (incomingCount > outgoingCount) {
        notes.push(`Depth gain at ${position}: +${incomingCount - outgoingCount}`)
      }
    }

    if (!notes.length) {
      notes.push("Depth impact minimal")
    }

    return notes
  }

  private computeFairness(netA: number, netB: number): TradeFairness {
    const delta = netA - netB
    const magnitude = Math.abs(delta)
    const scale = Math.max(Math.abs(netA), Math.abs(netB), 1)
    const normalized = clamp(1 - magnitude / (scale * 2))
    const score = Math.round(normalized * 100)

    let verdict: TradeFairness["verdict"] = "fair"
    if (delta > 0.5) verdict = "tilted-team-a"
    if (delta < -0.5) verdict = "tilted-team-b"

    const reasoning = `Team A net value ${netA.toFixed(1)} vs Team B ${netB.toFixed(1)}. Difference ${delta.toFixed(1)}.`

    return {
      score,
      verdict,
      reasoning,
    }
  }

  private buildRecommendation(teamA: PackageValue, teamB: PackageValue, fairness: TradeFairness): TradeRecommendation {
    const netDifference = Math.abs(teamA.net - teamB.net)
    const betterTeam = teamA.net > teamB.net ? "Team A" : "Team B"

    const accept = fairness.verdict === "fair" && netDifference < 10
    const confidence = clamp(1 - netDifference / 20)

    const summary = accept
      ? `Trade is balanced with ${fairness.score}% fairness score. ${betterTeam} gains slight edge.`
      : `Trade favors ${betterTeam}. Fairness score ${fairness.score}%.`

    const keyFactors = [
      `Team A net: ${teamA.net.toFixed(1)} pts`,
      `Team B net: ${teamB.net.toFixed(1)} pts`,
      `Weekly swing: ${(teamA.impact.weeklyPointDelta - teamB.impact.weeklyPointDelta).toFixed(2)} pts`,
    ]

    return {
      accept,
      confidence: Math.round(confidence * 100),
      summary,
      keyFactors,
    }
  }
}
