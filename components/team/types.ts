export interface TeamPlayer {
  id: string
  name: string
  position: string
  team: string
  opponent: string
  projection: number
  floor: number
  ceiling: number
  status?: "active" | "questionable" | "out"
}

export interface RosterSection {
  id: string
  title: string
  subtitle?: string
  players: TeamPlayer[]
}
