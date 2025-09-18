import type {
  SleeperChatMessage,
  SleeperLeagueImportResult,
  SleeperLeagueInfo,
  SleeperLeagueSettings,
  SleeperPlayerMetadata,
  SleeperRosterEntry,
  SleeperTransactionEntry,
  SleeperUserSummary,
} from "@/lib/league-importers/sleeper/types"

const SLEEPER_API_BASE = "https://api.sleeper.app/v1"

export async function fetchSleeperLeague(leagueId: string): Promise<SleeperLeagueInfo> {
  const response = await fetchJson<Record<string, unknown>>(`${SLEEPER_API_BASE}/league/${leagueId}`)
  const settings = isRecord(response.settings) ? response.settings : undefined
  const scoringType = typeof settings?.scoring_type === "string" ? settings.scoring_type : undefined

  return {
    id: String(response.league_id ?? leagueId),
    name: String(response.name ?? "Sleeper League"),
    season: Number(response.season ?? new Date().getFullYear()),
    sport: String(response.sport ?? "nfl"),
    seasonType: String(response.season_type ?? "regular"),
    scoringType: scoringType ?? "half_ppr",
    avatarUrl: response.avatar ? buildAvatarUrl(String(response.avatar)) : undefined,
    status: normalizeLeagueStatus(String(response.status ?? "in_progress")),
  }
}

export async function fetchSleeperUsers(leagueId: string): Promise<SleeperUserSummary[]> {
  const response = await fetchJson<Array<Record<string, unknown>>>(`${SLEEPER_API_BASE}/league/${leagueId}/users`)
  return response.map((user) => ({
    userId: String(user.user_id ?? ""),
    displayName: String(user.display_name ?? user.username ?? "Manager"),
    avatarUrl: user.avatar ? buildAvatarUrl(String(user.avatar)) : undefined,
  }))
}

export async function fetchSleeperRosters(leagueId: string): Promise<SleeperRosterEntry[]> {
  const response = await fetchJson<Array<Record<string, unknown>>>(`${SLEEPER_API_BASE}/league/${leagueId}/rosters`)
  return response.map((roster) => ({
    rosterId: Number(roster.roster_id ?? 0),
    ownerId: String(roster.owner_id ?? ""),
    starters: Array.isArray(roster.starters) ? roster.starters.map(String) : [],
    reserves: Array.isArray(roster.reserves) ? roster.reserves.map(String) : [],
    taxi: Array.isArray(roster.taxi) ? roster.taxi.map(String) : [],
    players: Array.isArray(roster.players) ? roster.players.map(String) : [],
  }))
}

export async function fetchSleeperPlayers(playerIds: string[]): Promise<SleeperPlayerMetadata[]> {
  if (!playerIds.length) {
    return []
  }
  const uniqueIds = Array.from(new Set(playerIds))
  const response = await fetchJson<Record<string, Record<string, unknown>>>("https://sleepercdn.com/content/nfl/players_full.json")
  return uniqueIds
    .map((id) => {
      const player = response[id]
      if (!player) return null
      return {
        playerId: id,
        fullName: String(player.full_name ?? player.last_name ?? id),
        position: String(player.position ?? ""),
        team: String(player.team ?? player.fantasy_positions?.[0] ?? ""),
        age: player.age ? Number(player.age) : undefined,
        status: typeof player.status === "string" ? player.status : undefined,
      }
    })
    .filter((player): player is SleeperPlayerMetadata => Boolean(player))
}

export async function fetchSleeperTransactions(leagueId: string, limit = 25): Promise<SleeperTransactionEntry[]> {
  const response = await fetchJson<Array<Record<string, unknown>>>(`${SLEEPER_API_BASE}/league/${leagueId}/transactions/${currentWeek()}`)
  return response.slice(0, limit).map((transaction) => ({
    id: String(transaction.transaction_id ?? ""),
    type: String(transaction.type ?? "other"),
    status: String(transaction.status ?? "unknown"),
    executedAt: toIso(transaction.updated ?? transaction.created ?? Date.now()),
    adds: recordMap(transaction.adds),
    drops: recordMap(transaction.drops),
  }))
}

export async function fetchSleeperChat(leagueId: string, limit = 30): Promise<SleeperChatMessage[]> {
  const response = await fetchJson<Array<Record<string, unknown>>>(`${SLEEPER_API_BASE}/league/${leagueId}/chat`)
  return response.slice(0, limit).map((message) => ({
    id: String(message.message_id ?? ""),
    authorId: String(message.sender_id ?? ""),
    authorName: String(message.username ?? message.sender_name ?? "Unknown"),
    message: String(message.content ?? message.body ?? ""),
    createdAt: toIso(message.timestamp ?? Date.now()),
  }))
}

export async function fetchSleeperSettings(leagueId: string): Promise<SleeperLeagueSettings> {
  await fetchSleeperLeague(leagueId)
  const response = await fetchJson<Record<string, unknown>>(`${SLEEPER_API_BASE}/league/${leagueId}/settings`)
  const rosterPositions = Array.isArray(response.roster_positions) ? response.roster_positions.map(String) : []
  const benchCount = Number(response.bench_slot_count ?? rosterPositions.filter((slot) => slot === "BN").length)
  const taxiCount = Number(response.taxi_slot_count ?? 0)
  const scoringRules = toScoringRules(response.scoring_settings)

  return {
    rosterPositions,
    benchCount,
    taxiCount,
    scoringRules,
  }
}

export async function buildSleeperImportViaApi(leagueId: string): Promise<SleeperLeagueImportResult> {
  const [league, users, rosters] = await Promise.all([
    fetchSleeperLeague(leagueId),
    fetchSleeperUsers(leagueId),
    fetchSleeperRosters(leagueId),
  ])

  const playerIds = rosters.flatMap((roster) => roster.players)
  const [players, settings, transactions, chat] = await Promise.all([
    fetchSleeperPlayers(playerIds),
    fetchSleeperSettings(leagueId),
    fetchSleeperTransactions(leagueId),
    fetchSleeperChat(leagueId),
  ])

  return {
    fetchedAt: new Date().toISOString(),
    league,
    users,
    rosters,
    players,
    settings,
    transactions,
    chat,
    screenshots: [],
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Sleeper API request failed: ${response.status}`)
  }
  return (await response.json()) as T
}

function recordMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") {
    return {}
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [String(key), String(val ?? "")]),
  )
}

function toIso(value: unknown): string {
  const timestamp = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(timestamp)) {
    return new Date().toISOString()
  }
  const ms = timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp
  return new Date(ms).toISOString()
}

function currentWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = Number(now) - Number(start)
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
}

function normalizeLeagueStatus(status: string): SleeperLeagueInfo["status"] {
  if (status === "pre_draft") return "drafting"
  if (status === "post_draft" || status === "in_season") return "in_progress"
  if (status === "complete") return "complete"
  return "in_progress"
}

function buildAvatarUrl(hash: string) {
  return `https://sleepercdn.com/avatars/${hash}`
}

function toScoringRules(input: unknown): SleeperLeagueSettings["scoringRules"] {
  if (!isRecord(input)) {
    return []
  }
  return Object.entries(input).map(([stat, value]) => ({
    stat,
    value: Number(value ?? 0),
  }))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
