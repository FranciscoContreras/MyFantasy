import { z } from "zod"

export const platformOptions = [
  { value: "espn", label: "ESPN", helper: "Includes league ID & scoring sync" },
  { value: "yahoo", label: "Yahoo", helper: "OAuth automation via Playwright" },
  { value: "sleeper", label: "Sleeper", helper: "Hybrid API + browser import" },
  { value: "cbs", label: "CBS", helper: "Full Playwright scraping" },
  { value: "custom", label: "Custom", helper: "Manual upload or CSV" },
] as const

export const seasonModeOptions = [
  { value: "redraft", label: "Redraft" },
  { value: "dynasty", label: "Dynasty" },
  { value: "keeper", label: "Keeper" },
  { value: "best-ball", label: "Best Ball" },
] as const

export const scoringOptions = [
  { value: "standard", label: "Standard" },
  { value: "half-ppr", label: "Half-PPR" },
  { value: "full-ppr", label: "Full-PPR" },
  { value: "custom", label: "Custom" },
] as const

export const syncFrequencies = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "manual", label: "Manual" },
] as const

export const alertChannels = [
  { value: "injury", label: "Injury alerts" },
  { value: "lineup", label: "Lineup reminders" },
  { value: "trade", label: "Trade proposals" },
  { value: "news", label: "News + weather" },
] as const

export const flexPositionOptions = [
  { value: "rb", label: "RB" },
  { value: "wr", label: "WR" },
  { value: "te", label: "TE" },
  { value: "qb", label: "QB" },
] as const

const rosterSchema = z.object({
  qb: z.number().min(1).max(3),
  rb: z.number().min(1).max(6),
  wr: z.number().min(1).max(6),
  te: z.number().min(1).max(4),
  flex: z.number().min(0).max(3),
  superflex: z.number().min(0).max(2),
  bench: z.number().min(0).max(12),
})

export const leagueSettingsSchema = z
  .object({
    leagueName: z.string().min(2, "League name is required"),
    platform: z.enum(platformOptions.map((o) => o.value) as [string, ...string[]]),
    seasonMode: z.enum(seasonModeOptions.map((o) => o.value) as [string, ...string[]]),
    scoringType: z.enum(scoringOptions.map((o) => o.value) as [string, ...string[]]),
    pprValue: z.number().min(0).max(1),
    tePremium: z.number().min(0).max(2),
    roster: rosterSchema,
    flexPositions: z.array(z.enum(flexPositionOptions.map((o) => o.value) as [string, ...string[]])).min(1),
    allowWaivers: z.boolean(),
    autoSync: z.boolean(),
    syncFrequency: z.enum(syncFrequencies.map((o) => o.value) as [string, ...string[]]),
    alerts: z.array(z.enum(alertChannels.map((o) => o.value) as [string, ...string[]])),
    emailReports: z.boolean(),
    slackAlerts: z.boolean(),
  })
  .refine((data) => (data.autoSync ? data.syncFrequency !== "manual" : true), {
    message: "Select a sync cadence when auto-sync is enabled",
    path: ["syncFrequency"],
  })

export type LeagueSettingsValues = z.infer<typeof leagueSettingsSchema>

export const defaultLeagueSettings: LeagueSettingsValues = {
  leagueName: "Bay Area Legends",
  platform: "espn",
  seasonMode: "redraft",
  scoringType: "full-ppr",
  pprValue: 1,
  tePremium: 0.5,
  roster: {
    qb: 1,
    rb: 2,
    wr: 3,
    te: 1,
    flex: 1,
    superflex: 0,
    bench: 6,
  },
  flexPositions: ["rb", "wr", "te"],
  allowWaivers: true,
  autoSync: true,
  syncFrequency: "daily",
  alerts: ["injury", "lineup", "trade"],
  emailReports: true,
  slackAlerts: false,
}
