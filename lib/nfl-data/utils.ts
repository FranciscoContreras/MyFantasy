export function getCurrentSeason(reference: Date = new Date()): number {
  const year = reference.getUTCFullYear()
  const month = reference.getUTCMonth() + 1
  // NFL regular season begins in September; use calendar year for Jan/Feb playoffs.
  return month >= 3 ? year : year - 1
}

export type QueryValue = string | number | boolean | undefined | null
export type QueryParams = Record<string, QueryValue | QueryValue[]>

export function buildQuery(params?: QueryParams): string {
  if (!params) return ""
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    const values = Array.isArray(value) ? value : [value]
    for (const item of values) {
      search.append(key, String(item))
    }
  }

  const query = search.toString()
  return query ? `?${query}` : ""
}

export function buildScoreboardDateRange(season: number, startMonth = 9, endMonth = 2): string {
  const start = `${season}${pad(startMonth)}01`
  const end = `${season + 1}${pad(endMonth)}01`
  return `${start}-${end}`
}

function pad(value: number): string {
  return value.toString().padStart(2, "0")
}
