export interface SchemeSnapshot {
  teamId: string
  blitzRate: number
  pressureRate: number
  manCoverageRate: number
  zoneCoverageRate: number
  notes?: string
}

export const schemeSnapshots: SchemeSnapshot[] = [
  {
    teamId: "KC",
    blitzRate: 0.32,
    pressureRate: 0.27,
    manCoverageRate: 0.38,
    zoneCoverageRate: 0.62,
    notes: "Spagnuolo leans on simulated pressures with disguised coverages.",
  },
  {
    teamId: "PHI",
    blitzRate: 0.22,
    pressureRate: 0.30,
    manCoverageRate: 0.28,
    zoneCoverageRate: 0.72,
    notes: "Heavy zone looks with elite front-four pressure rate.",
  },
  {
    teamId: "BUF",
    blitzRate: 0.18,
    pressureRate: 0.26,
    manCoverageRate: 0.24,
    zoneCoverageRate: 0.76,
    notes: "Rarely blitz but closes passing windows with hybrid zone.",
  },
  {
    teamId: "DAL",
    blitzRate: 0.33,
    pressureRate: 0.31,
    manCoverageRate: 0.42,
    zoneCoverageRate: 0.58,
    notes: "Quinn brings heat off the edge and rotates man/zone mid-drive.",
  },
  {
    teamId: "SF",
    blitzRate: 0.19,
    pressureRate: 0.29,
    manCoverageRate: 0.30,
    zoneCoverageRate: 0.70,
    notes: "Four-man rush with match-zone principles to erase explosives.",
  },
]

export function findSchemeSnapshot(teamId: string) {
  return schemeSnapshots.find((snapshot) => snapshot.teamId === teamId)
}
