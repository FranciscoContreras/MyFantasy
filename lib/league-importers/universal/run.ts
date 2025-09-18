import { runUniversalImport } from "@/lib/league-importers/universal/handler"
import { detectPlatform } from "@/lib/league-importers/universal/detect"
import type { SupportedPlatform } from "@/lib/league-importers/universal/types"

interface RunnerArgs {
  source: string
  platform?: SupportedPlatform
  screenshotDashboard?: string
  screenshotScoring?: string
  screenshotSupplemental?: string
  chatLimit?: number
  retryCount?: number
  headless?: boolean
}

async function run() {
  const args = parseArgs()
  if (!args.platform) {
    const detection = detectPlatform(args.source)
    console.log(`[detect] platform=${detection.platform} confidence=${detection.confidence}`)
  }

  const result = await runUniversalImport({
    source: args.source,
    platform: args.platform,
    headless: args.headless,
    screenshots: {
      dashboard: args.screenshotDashboard,
      scoring: args.screenshotScoring,
      supplemental: args.screenshotSupplemental,
    },
    chatLimit: args.chatLimit,
    retryCount: args.retryCount,
    credentialProvider: async ({ platform }) => {
      const envPrefix = platform.toUpperCase()
      const username = process.env[`${envPrefix}_USERNAME`]
      const password = process.env[`${envPrefix}_PASSWORD`]
      if (!username || !password) {
        throw new Error(`Missing ${envPrefix}_USERNAME or ${envPrefix}_PASSWORD environment variables`)
      }
      return { username, password }
    },
    onProgress: (event) => {
      console.log(`[${event.platform}] ${event.step}: ${event.message ?? ""}`)
    },
  })

  console.log(JSON.stringify(result, null, 2))
}

function parseArgs(): RunnerArgs {
  const params = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, value] = arg.replace(/^--/, "").split("=")
      return [key, value]
    }),
  )

  if (!params.source) {
    throw new Error("--source argument required")
  }

  return {
    source: String(params.source),
    platform: params.platform ? (params.platform as SupportedPlatform) : undefined,
    screenshotDashboard: params.screenshotDashboard ? String(params.screenshotDashboard) : undefined,
    screenshotScoring: params.screenshotScoring ? String(params.screenshotScoring) : undefined,
    screenshotSupplemental: params.screenshotSupplemental ? String(params.screenshotSupplemental) : undefined,
    chatLimit: params.chatLimit ? Number(params.chatLimit) : undefined,
    retryCount: params.retryCount ? Number(params.retryCount) : undefined,
    headless: params.headless ? params.headless !== "false" : true,
  }
}

run().catch((error) => {
  console.error("Universal importer failed", error)
  process.exit(1)
})
