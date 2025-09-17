import { clamp, roundTo } from "@/lib/analysis/utils"
import type {
  LineupConstraints,
  LineupEvaluation,
  LineupPlayer,
  LineupResult,
  LineupSlot,
  OptimizerInput,
  OptimizerOptions,
  PlayerProjection,
} from "@/lib/optimization/types"

interface SearchState {
  players: LineupPlayer[]
  usedPlayerIds: Set<string>
  teamCounts: Record<string, number>
  totalMean: number
  totalFloor: number
  totalCeiling: number
  totalConfidence: number
  salary: number
}

export class LineupOptimizer {
  async optimize({ players, constraints, options }: OptimizerInput): Promise<LineupResult[]> {
    if (!constraints.slots.length) {
      return []
    }

    const resolvedOptions: Required<OptimizerOptions> = {
      maxLineups: options?.maxLineups ?? 5,
      maxCandidatesPerSlot: options?.maxCandidatesPerSlot ?? 12,
      riskTolerance: clamp(options?.riskTolerance ?? 0.5),
      allowDuplicatePlayersAcrossLineups: options?.allowDuplicatePlayersAcrossLineups ?? true,
      minFloor: options?.minFloor ?? 0,
      minMean: options?.minMean ?? 0,
    }

    const slotCandidates = this.buildSlotCandidates(players, constraints.slots, resolvedOptions.maxCandidatesPerSlot)
    const topLineups: LineupResult[] = []
    const visitedLineups = new Set<string>()

    const state: SearchState = {
      players: [],
      usedPlayerIds: new Set(),
      teamCounts: {},
      totalMean: 0,
      totalFloor: 0,
      totalCeiling: 0,
      totalConfidence: 0,
      salary: 0,
    }

    this.search(0, constraints, resolvedOptions, slotCandidates, state, topLineups, visitedLineups)

    return topLineups
      .sort((a, b) => b.score - a.score)
      .map((lineup, index) => ({ ...lineup, rank: index + 1 }))
  }

  private buildSlotCandidates(players: PlayerProjection[], slots: LineupSlot[], maxCandidatesPerSlot: number) {
    const sortedPlayers = [...players].sort((a, b) => b.mean - a.mean)
    return slots.map((slot) =>
      sortedPlayers
        .filter((player) => slot.allowedPositions.includes(player.position))
        .slice(0, maxCandidatesPerSlot),
    )
  }

  private search(
    slotIndex: number,
    constraints: LineupConstraints,
    options: Required<OptimizerOptions>,
    slotCandidates: PlayerProjection[][],
    state: SearchState,
    topLineups: LineupResult[],
    visitedLineups: Set<string>,
  ) {
    const slots = constraints.slots
    if (slotIndex === slots.length) {
      const evaluation = this.evaluateLineup(state)
      if (evaluation.totalMean < options.minMean || evaluation.totalFloor < options.minFloor) {
        return
      }
      if (!this.satisfiesTeamConstraints(constraints, state.teamCounts)) {
        return
      }
      const lineupId = state.players
        .map((player) => player.playerId)
        .sort()
        .join("|")
      if (!options.allowDuplicatePlayersAcrossLineups && visitedLineups.has(lineupId)) {
        return
      }
      visitedLineups.add(lineupId)

      const score = this.computeScore(evaluation, options.riskTolerance)
      const variance = evaluation.totalCeiling - evaluation.totalFloor
      const notes = this.buildNotes(evaluation, variance, options.riskTolerance)

      this.insertLineup(topLineups, {
        id: lineupId,
        players: [...state.players],
        evaluation,
        score,
        variance,
        rank: 0,
        notes,
      }, options.maxLineups)
      return
    }

    const slot = slots[slotIndex]
    const candidates = slotCandidates[slotIndex]
    if (!candidates?.length) {
      return
    }

    for (const candidate of candidates) {
      if (state.usedPlayerIds.has(candidate.playerId)) {
        continue
      }
      if (constraints.maxPerTeam && (state.teamCounts[candidate.teamId] ?? 0) >= constraints.maxPerTeam) {
        continue
      }
      const salaryAccum = state.salary + (candidate.salary ?? 0)
      if (constraints.salaryCap && salaryAccum > constraints.salaryCap) {
        continue
      }

      const newTeamCounts = { ...state.teamCounts, [candidate.teamId]: (state.teamCounts[candidate.teamId] ?? 0) + 1 }
      if (!this.respectsStackMaximums(constraints, newTeamCounts)) {
        continue
      }

      state.players.push(this.toLineupPlayer(slot, candidate))
      state.usedPlayerIds.add(candidate.playerId)
      state.teamCounts = newTeamCounts
      state.totalMean += candidate.mean
      state.totalFloor += candidate.floor
      state.totalCeiling += candidate.ceiling
      state.totalConfidence += candidate.confidence
      state.salary = salaryAccum

      const optimistic = this.estimateOptimisticScore(slotIndex + 1, slotCandidates, state, options)
      if (this.shouldPrune(topLineups, optimistic, options.maxLineups)) {
        this.backtrack(state, candidate)
        continue
      }

      this.search(slotIndex + 1, constraints, options, slotCandidates, state, topLineups, visitedLineups)
      this.backtrack(state, candidate)
    }
  }

  private toLineupPlayer(slot: LineupSlot, candidate: PlayerProjection): LineupPlayer {
    return {
      slotId: slot.id,
      playerId: candidate.playerId,
      name: candidate.name,
      teamId: candidate.teamId,
      position: candidate.position,
      mean: candidate.mean,
      floor: candidate.floor,
      ceiling: candidate.ceiling,
      confidence: candidate.confidence,
      salary: candidate.salary,
    }
  }

  private backtrack(state: SearchState, candidate: PlayerProjection) {
    state.players.pop()
    state.usedPlayerIds.delete(candidate.playerId)
    const updatedCount = (state.teamCounts[candidate.teamId] ?? 0) - 1
    if (updatedCount <= 0) {
      delete state.teamCounts[candidate.teamId]
    } else {
      state.teamCounts[candidate.teamId] = updatedCount
    }
    state.totalMean -= candidate.mean
    state.totalFloor -= candidate.floor
    state.totalCeiling -= candidate.ceiling
    state.totalConfidence -= candidate.confidence
    state.salary -= candidate.salary ?? 0
  }

  private evaluateLineup(state: SearchState): LineupEvaluation {
    const totalMean = roundTo(state.totalMean, 3)
    const totalFloor = roundTo(state.totalFloor, 3)
    const totalCeiling = roundTo(state.totalCeiling, 3)
    const confidence = roundTo(clamp(state.totalConfidence / Math.max(state.players.length, 1) / 100), 3)
    return {
      totalMean,
      totalFloor,
      totalCeiling,
      confidence,
      salary: state.salary,
      teams: { ...state.teamCounts },
    }
  }

  private computeScore(evaluation: LineupEvaluation, riskTolerance: number) {
    const meanComponent = evaluation.totalMean
    const floorComponent = evaluation.totalFloor * (1 - riskTolerance) * 0.5
    const ceilingComponent = evaluation.totalCeiling * riskTolerance * 0.5
    const confidenceBoost = evaluation.confidence * 5
    return roundTo(meanComponent + floorComponent + ceilingComponent + confidenceBoost, 4)
  }

  private buildNotes(evaluation: LineupEvaluation, variance: number, riskTolerance: number) {
    const notes: string[] = []
    const floorRatio = evaluation.totalFloor / Math.max(evaluation.totalMean, 0.01)
    if (floorRatio > 0.85) {
      notes.push("High floor lineup")
    }
    if (variance > evaluation.totalMean * 0.6) {
      notes.push("High upside lineup")
    }
    if (riskTolerance < 0.4 && floorRatio < 0.7) {
      notes.push("Consider safer alternatives for cash games")
    }
    return notes
  }

  private satisfiesTeamConstraints(constraints: LineupConstraints, teamCounts: Record<string, number>) {
    if (constraints.minTeams && Object.keys(teamCounts).length < constraints.minTeams) {
      return false
    }
    if (constraints.stackConstraints?.length) {
      for (const stack of constraints.stackConstraints) {
        const current = teamCounts[stack.teamId] ?? 0
        if (stack.minPlayers && current < stack.minPlayers) {
          return false
        }
        if (stack.maxPlayers && current > stack.maxPlayers) {
          return false
        }
      }
    }
    return true
  }

  private respectsStackMaximums(constraints: LineupConstraints, teamCounts: Record<string, number>) {
    if (!constraints.stackConstraints?.length) {
      return true
    }
    return constraints.stackConstraints.every((stack) => {
      if (!stack.maxPlayers) {
        return true
      }
      return (teamCounts[stack.teamId] ?? 0) <= stack.maxPlayers
    })
  }

  private insertLineup(lineups: LineupResult[], lineup: LineupResult, maxLineups: number) {
    lineups.push(lineup)
    lineups.sort((a, b) => b.score - a.score)
    if (lineups.length > maxLineups) {
      lineups.length = maxLineups
    }
  }

  private estimateOptimisticScore(
    nextSlotIndex: number,
    slotCandidates: PlayerProjection[][],
    state: SearchState,
    options: Required<OptimizerOptions>,
  ) {
    let optimisticMean = state.totalMean
    let optimisticFloor = state.totalFloor
    let optimisticCeiling = state.totalCeiling
    const used = state.usedPlayerIds

    for (let i = nextSlotIndex; i < slotCandidates.length; i += 1) {
      const candidate = slotCandidates[i].find((player) => !used.has(player.playerId))
      if (!candidate) {
        continue
      }
      optimisticMean += candidate.mean
      optimisticFloor += candidate.floor
      optimisticCeiling += candidate.ceiling
    }

    const pseudoEvaluation: LineupEvaluation = {
      totalMean: optimisticMean,
      totalFloor: optimisticFloor,
      totalCeiling: optimisticCeiling,
      confidence: clamp(state.totalConfidence / Math.max(state.players.length, 1) / 100),
      salary: state.salary,
      teams: { ...state.teamCounts },
    }

    return this.computeScore(pseudoEvaluation, options.riskTolerance)
  }

  private shouldPrune(lineups: LineupResult[], optimisticScore: number, maxLineups: number) {
    if (lineups.length < maxLineups) {
      return false
    }
    const worst = lineups[lineups.length - 1]
    return optimisticScore <= worst.score
  }
}

export const lineupOptimizer = new LineupOptimizer()
