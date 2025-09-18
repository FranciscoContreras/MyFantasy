import { clamp } from "@/lib/analysis/utils"
import type {
  TradeAnalyzerInput,
  TradeAnalysisResult,
  TradeFairness,
  TradeImpactSummary,
  TradePackage,
  TradeRecommendation,
  TradeValueBreakdown,
  TradePlayerValuation,
} from "@/lib/trades/types"

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

    const rosterNotes = this.buildRosterNotes(trade.playersSent, trade.playersReceived, outgoing, incoming)
    const weeklyPointDelta = incoming.perGame - outgoing.perGame
    const recordDelta = weeklyPointDelta * gamesRemaining * 0.02
    const basePlayoff = trade.playoffProbability ?? 0.5
    const projectedPlayoff = clamp(basePlayoff + recordDelta * 0.05 + weeklyPointDelta * 0.004)
    const playoffDelta = projectedPlayoff - basePlayoff

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
        players: [],
      }
    }

    let total = 0
    let perGame = 0
    let floor = 0
    let ceiling = 0
    let riskAggregate = 0
    let scheduleAggregate = 0
    const playerValuations: TradePlayerValuation[] = []

    for (const player of players) {
      const projection = player.restOfSeasonProjection
      const risk = clamp(1 - (player.injuryRisk ?? 0.25))
      const schedule = clamp(player.scheduleDifficulty ?? 0.5)

      const scheduleMultiplier = 0.9 + schedule * 0.2
      const adjustedPerGameRaw = projection * scheduleMultiplier
      const adjustedPerGame = adjustedPerGameRaw * risk
      const restOfSeasonTotal = adjustedPerGame * gamesRemaining
      const floorValue = adjustedPerGameRaw * 0.85 * risk
      const ceilingValue = adjustedPerGameRaw * (1.15 + schedule * 0.05)

      playerValuations.push({
        id: player.id,
        name: player.name,
        position: player.position,
        team: player.team,
        restOfSeasonProjection: Number(projection.toFixed(2)),
        adjustedPerGame: Number(adjustedPerGame.toFixed(2)),
        restOfSeasonTotal: Number(restOfSeasonTotal.toFixed(1)),
        floor: Number(floorValue.toFixed(2)),
        ceiling: Number(ceilingValue.toFixed(2)),
        riskScore: Number(risk.toFixed(2)),
        scheduleScore: Number(schedule.toFixed(2)),
        byeWeeksRemaining: player.byeWeeksRemaining,
      })

      perGame += adjustedPerGame
      total += restOfSeasonTotal
      floor += floorValue
      ceiling += ceilingValue

      riskAggregate += risk
      scheduleAggregate += schedule
    }

    const count = playerValuations.length
    return {
      total: Number(total.toFixed(1)),
      perGame: Number(perGame.toFixed(2)),
      floor: Number(floor.toFixed(2)),
      ceiling: Number(ceiling.toFixed(2)),
      riskAdjustment: Number((riskAggregate / count).toFixed(2)),
      scheduleAdjustment: Number((scheduleAggregate / count).toFixed(2)),
      players: playerValuations,
    }
  }

  private buildRosterNotes(
    outgoing: TradePackage["playersSent"],
    incoming: TradePackage["playersReceived"],
    outgoingValue: TradeValueBreakdown,
    incomingValue: TradeValueBreakdown,
  ): string[] {
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

    const riskDelta = incomingValue.riskAdjustment - outgoingValue.riskAdjustment
    if (Math.abs(riskDelta) >= 0.05) {
      notes.push(riskDelta >= 0 ? "Stability improves (lower injury risk)" : "Adds volatility from injury risk")
    }

    const scheduleDelta = incomingValue.scheduleAdjustment - outgoingValue.scheduleAdjustment
    if (Math.abs(scheduleDelta) >= 0.05) {
      notes.push(scheduleDelta >= 0 ? "Schedule eases rest-of-season" : "Schedule difficulty increases")
    }

    const ceilingDelta = incomingValue.ceiling - outgoingValue.ceiling
    if (Math.abs(ceilingDelta) >= 1.5) {
      notes.push(ceilingDelta >= 0 ? `Upside rises by ${ceilingDelta.toFixed(1)} pts` : `Upside drops by ${Math.abs(ceilingDelta).toFixed(1)} pts`)
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

    const reasoning = `Team A net value ${netA.toFixed(1)} vs Team B ${netB.toFixed(1)} (Δ ${delta.toFixed(1)}).`

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

    const teamARiskDelta = teamA.incoming.riskAdjustment - teamA.outgoing.riskAdjustment
    if (Math.abs(teamARiskDelta) >= 0.05) {
      keyFactors.push(`Team A risk profile ${teamARiskDelta >= 0 ? "stabilises" : "weakens"} (${(teamARiskDelta * 100).toFixed(0)}%)`)
    }

    const teamBScheduleDelta = teamB.incoming.scheduleAdjustment - teamB.outgoing.scheduleAdjustment
    if (Math.abs(teamBScheduleDelta) >= 0.05) {
      keyFactors.push(`Team B schedule ${(teamBScheduleDelta >= 0 ? "eases" : "tightens")} ${(Math.abs(teamBScheduleDelta) * 100).toFixed(0)}%`)
    }

    return {
      accept,
      confidence: Math.round(confidence * 100),
      summary,
      keyFactors,
    }
  }
}
