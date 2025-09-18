import { chromium } from "playwright"

import { EspnLeagueImporter } from "@/lib/league-importers/espn/automation"

interface RunnerArgs {
  leagueId: string
  season: number
  username: string
  password: string
  headless?: boolean
  screenshot?: string
}

async function run() {
  const args = parseArgs()
  const browser = await chromium.launch({ headless: args.headless ?? true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    const importer = new EspnLeagueImporter({
      leagueId: args.leagueId,
      season: args.season,
      username: args.username,
      password: args.password,
      headless: args.headless,
      screenshotPath: args.screenshot,
    })

    const result = await importer.run(page)
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
}

function parseArgs(): RunnerArgs {
  const params = Object.fromEntries(process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, "").split("=")
    return [key, value]
  }))

  const required = ["leagueId", "season", "username", "password"] as const
  for (const key of required) {
    if (!params[key]) {
      throw new Error(`Missing required argument --${key}`)
    }
  }

  return {
    leagueId: String(params.leagueId),
    season: Number(params.season),
    username: String(params.username),
    password: String(params.password),
    headless: params.headless ? params.headless !== "false" : true,
    screenshot: params.screenshot ? String(params.screenshot) : undefined,
  }
}

run().catch((error) => {
  console.error("ESPN importer failed", error)
  process.exit(1)
})
