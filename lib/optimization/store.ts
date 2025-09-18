import type { LineupResult } from "@/lib/optimization"

const lineupStore = new Map<string, LineupResult[]>()

export function saveLineups(key: string, lineups: LineupResult[]) {
  lineupStore.set(key, lineups)
}

export function getLineups(key: string) {
  return lineupStore.get(key) ?? []
}

export function clearLineups(key?: string) {
  if (key) {
    lineupStore.delete(key)
    return
  }
  lineupStore.clear()
}
