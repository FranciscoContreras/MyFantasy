import { chromium } from "playwright"

import { SleeperLeagueImporter } from "@/lib/league-importers/sleeper/automation"

interface RunnerArgs {
  leagueId: string
  username: string
  password: string
  headless?: boolean
  screenshotSettings?: string
  screenshotChat?: string
  chatLimit?: number
}

async function run() {
  const args = parseArgs()
  const browser = await chromium.launch({ headless: args.headless ?? true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    const importer = new SleeperLeagueImporter({
      leagueId: args.leagueId,
      username: args.username,
      password: args.password,
      headless: args.headless,
      chatLimit: args.chatLimit,
      screenshots: {
        settings: args.screenshotSettings,
        chat: args.screenshotChat,
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

  const required = ["leagueId", "username", "password"] as const
  for (const key of required) {
    if (!params[key]) {
      throw new Error(`Missing required argument --${key}`)
    }
  }

  return {
    leagueId: String(params.leagueId),
    username: String(params.username),
    password: String(params.password),
    headless: params.headless ? params.headless !== "false" : true,
    screenshotSettings: params.screenshotSettings ? String(params.screenshotSettings) : undefined,
    screenshotChat: params.screenshotChat ? String(params.screenshotChat) : undefined,
    chatLimit: params.chatLimit ? Number(params.chatLimit) : undefined,
  }
}

run().catch((error) => {
  console.error("Sleeper importer failed", error)
  process.exit(1)
})
