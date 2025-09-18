import type { PlatformDetectionResult, SupportedPlatform } from "@/lib/league-importers/universal/types"

const DETECTION_PATTERNS: Array<{ platform: SupportedPlatform; pattern: RegExp; details: string }> = [
  { platform: "espn", pattern: /espn\.com/i, details: "ESPN domain detected" },
  { platform: "yahoo", pattern: /yahoo\.com/i, details: "Yahoo domain detected" },
  { platform: "sleeper", pattern: /sleeper\.com|sleeper\./i, details: "Sleeper domain detected" },
  { platform: "cbs", pattern: /cbssports\.com/i, details: "CBS Sports domain detected" },
]

export function detectPlatform(source: string): PlatformDetectionResult {
  for (const detector of DETECTION_PATTERNS) {
    if (detector.pattern.test(source)) {
      return {
        platform: detector.platform,
        confidence: 0.95,
        details: detector.details,
      }
    }
  }

  if (/^410\.l\./.test(source)) {
    return { platform: "yahoo", confidence: 0.8, details: "Yahoo league key format" }
  }
  if (/^\d{9}$/.test(source)) {
    return { platform: "sleeper", confidence: 0.75, details: "Sleeper numeric league ID" }
  }

  return {
    platform: "espn",
    confidence: 0.4,
    details: "Defaulting to ESPN; manual confirmation required",
  }
}
