import { chromium } from "playwright"

import { YahooLeagueImporter } from "@/lib/league-importers/yahoo/automation"

interface RunnerArgs {
  leagueKey: string
  leagueUrl?: string
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
    const importer = new YahooLeagueImporter({
      leagueKey: args.leagueKey,
      leagueUrl: args.leagueUrl,
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
  const params = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, value] = arg.replace(/^--/, "").split("=")
      return [key, value]
    }),
  )

  const required = ["leagueKey", "username", "password"] as const
  for (const key of required) {
    if (!params[key]) {
      throw new Error(`Missing required argument --${key}`)
    }
  }

  return {
    leagueKey: String(params.leagueKey),
    leagueUrl: params.leagueUrl ? String(params.leagueUrl) : undefined,
    username: String(params.username),
    password: String(params.password),
    headless: params.headless ? params.headless !== "false" : true,
    screenshot: params.screenshot ? String(params.screenshot) : undefined,
  }
}

run().catch((error) => {
  console.error("Yahoo importer failed", error)
  process.exit(1)
})
