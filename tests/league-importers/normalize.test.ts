import { normalizeSample } from "@/lib/league-importers/universal/handler"
import type { SupportedPlatform } from "@/lib/league-importers/universal/types"

const platforms: SupportedPlatform[] = ["espn", "yahoo", "sleeper", "cbs"]

describe("normalizeSample", () => {
  it("returns well-formed normalized data for each supported platform", () => {
    for (const platform of platforms) {
      const normalized = normalizeSample(platform)

      expect(normalized.platform).toBe(platform)
      expect(normalized.league.id).toBeDefined()
      expect(normalized.teams.length).toBeGreaterThan(0)
      expect(normalized.rosters.length).toBeGreaterThan(0)
      expect(normalized.scoringRules.length).toBeGreaterThan(0)
      expect(Array.isArray(normalized.verification.screenshots)).toBe(true)

      const rosterTeamIds = new Set(normalized.rosters.map((roster) => roster.teamId))
      for (const team of normalized.teams) {
        expect(rosterTeamIds.has(team.id)).toBe(true)
      }
    }
  })
})
