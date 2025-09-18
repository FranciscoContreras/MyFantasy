import type { EspnLeagueImportResult } from "@/lib/league-importers/espn/types"
import type { YahooLeagueImportResult } from "@/lib/league-importers/yahoo/types"
import type { SleeperLeagueImportResult } from "@/lib/league-importers/sleeper/types"
import type { CbsLeagueImportResult } from "@/lib/league-importers/cbs/types"

export type SupportedPlatform = "espn" | "yahoo" | "sleeper" | "cbs"

export interface PlatformDetectionResult {
  platform: SupportedPlatform
  confidence: number
  details?: string
}

export interface CredentialRequest {
  platform: SupportedPlatform
  fields: Array<"username" | "password"> & { length: number }
}

export interface ImportCredentials {
  username?: string
  password?: string
  token?: string
}

export interface UniversalImportOptions {
  source: string
  platform?: SupportedPlatform
  headless?: boolean
  credentials?: Partial<Record<SupportedPlatform, ImportCredentials>>
  screenshots?: {
    dashboard?: string
    scoring?: string
    supplemental?: string
  }
  chatLimit?: number
  retryCount?: number
  onProgress?: (event: ImportProgressEvent) => void
  credentialProvider?: (request: CredentialRequest) => Promise<ImportCredentials>
}

export interface ImportProgressEvent {
  platform: SupportedPlatform | "unknown"
  step: "detect" | "credentials" | "authenticate" | "fetch" | "normalize" | "complete" | "error"
  message?: string
  progress?: number
  data?: Record<string, unknown>
}

export interface NormalizedLeagueData {
  platform: SupportedPlatform
  league: {
    id: string
    name: string
    season: number
    sport?: string
    scoringType?: string
    url?: string
  }
  teams: Array<{
    id: string
    name: string
    manager?: string
    record?: {
      wins: number
      losses: number
      ties: number
    }
    pointsFor?: number
    pointsAgainst?: number
  }>
  rosters: Array<{
    teamId: string
    players: Array<{
      id: string
      name: string
      position?: string
      team?: string
      slot?: string
      status?: string
      projectedPoints?: number
      actualPoints?: number
      notes?: string
    }>
  }>
  scoringRules: Array<{
    category: string
    value: number
    description?: string
  }>
  transactions?: Array<{
    id: string
    type: string
    executedAt: string
    summary?: string
    teamsInvolved?: string[]
  }>
  chat?: Array<{
    id: string
    author: string
    message: string
    createdAt: string
  }>
  playerNotes?: Array<{
    playerId: string
    title: string
    content: string
    timestamp: string
    source?: string
  }>
  verification: {
    screenshots: string[]
  }
  raw?: Record<string, unknown>
}

export type PlatformImportResult =
  | { platform: "espn"; result: EspnLeagueImportResult }
  | { platform: "yahoo"; result: YahooLeagueImportResult }
  | { platform: "sleeper"; result: SleeperLeagueImportResult }
  | { platform: "cbs"; result: CbsLeagueImportResult }
