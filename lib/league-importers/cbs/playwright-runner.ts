import { chromium } from "playwright"

import { CbsLeagueImporter } from "@/lib/league-importers/cbs/automation"

interface RunnerArgs {
  leagueUrl: string
  username: string
  password: string
  headless?: boolean
  screenshotDashboard?: string
  screenshotScoring?: string
  screenshotPlayerNotes?: string
  retryCount?: number
}

async function run() {
  const args = parseArgs()
  const browser = await chromium.launch({ headless: args.headless ?? true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    const importer = new CbsLeagueImporter({
      leagueUrl: args.leagueUrl,
      username: args.username,
      password: args.password,
      headless: args.headless,
      retryCount: args.retryCount,
      screenshotPaths: {
        dashboard: args.screenshotDashboard,
        scoring: args.screenshotScoring,
        playerNotes: args.screenshotPlayerNotes,
      },
    })

    const result = await importer.run(page)
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
}

function parseArgs(): RunnerArgs {
  const params = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, value] = arg.replace(/^--/, "").split("=")
      return [key, value]
    }),
  )

  const required = ["leagueUrl", "username", "password"] as const
  for (const key of required) {
    if (!params[key]) {
      throw new Error(`Missing required argument --${key}`)
    }
  }

  return {
    leagueUrl: String(params.leagueUrl),
    username: String(params.username),
    password: String(params.password),
    headless: params.headless ? params.headless !== "false" : true,
    screenshotDashboard: params.screenshotDashboard ? String(params.screenshotDashboard) : undefined,
    screenshotScoring: params.screenshotScoring ? String(params.screenshotScoring) : undefined,
    screenshotPlayerNotes: params.screenshotPlayerNotes ? String(params.screenshotPlayerNotes) : undefined,
    retryCount: params.retryCount ? Number(params.retryCount) : undefined,
  }
}

run().catch((error) => {
  console.error("CBS importer failed", error)
  process.exit(1)
})
