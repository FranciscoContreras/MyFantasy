import type { Page } from "playwright"

import { buildSleeperImportViaApi } from "@/lib/league-importers/sleeper/api"
import { getSampleSleeperLeagueImport } from "@/lib/league-importers/sleeper/sample"
import type { SleeperLeagueImportResult, SleeperChatMessage } from "@/lib/league-importers/sleeper/types"

interface SleeperImporterOptions {
  leagueId: string
  username: string
  password: string
  headless?: boolean
  screenshots?: {
    settings?: string
    chat?: string
  }
  chatLimit?: number
}

export class SleeperLeagueImporter {
  constructor(private readonly options: SleeperImporterOptions) {}

  async run(page: Page): Promise<SleeperLeagueImportResult> {
    const apiResult = await buildSleeperImportViaApi(this.options.leagueId)

    try {
      await this.login(page)
      await this.navigateToLeague(page)

      const webChat = await this.collectChatFromWeb(page, this.options.chatLimit ?? 30)
      const mergedChat = mergeChat(apiResult.chat, webChat)

      if (this.options.screenshots?.settings) {
        await this.captureSettingsScreenshot(page, this.options.screenshots.settings)
      }

      if (this.options.screenshots?.chat) {
        await this.captureChatScreenshot(page, this.options.screenshots.chat)
      }

      return {
        ...apiResult,
        chat: mergedChat,
        screenshots: [
          ...(apiResult.screenshots ?? []),
          ...(this.options.screenshots?.settings ? [this.options.screenshots.settings] : []),
          ...(this.options.screenshots?.chat ? [this.options.screenshots.chat] : []),
        ],
      }
    } catch (error) {
      console.warn("[SleeperLeagueImporter] falling back to sample", error)
      const sample = getSampleSleeperLeagueImport()
      return { ...sample, raw: { source: "sample" } }
    }
  }

  private async login(page: Page) {
    await page.goto("https://sleeper.com/login", { waitUntil: "domcontentloaded" })
    await page.fill('input[name="username"]', this.options.username)
    await page.fill('input[type="password"]', this.options.password)
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button[type="submit"]'),
    ])
  }

  private async navigateToLeague(page: Page) {
    await page.goto(`https://sleeper.com/leagues/${this.options.leagueId}`, { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  }

  private async collectChatFromWeb(page: Page, limit: number): Promise<SleeperChatMessage[]> {
    try {
      await page.click('a[href$="/chat"]', { timeout: 5000 })
      await page.waitForSelector("[data-testid=chat-message]", { timeout: 5000 })
      const chat = await page.evaluate((maxMessages) => {
        const nodes = Array.from(document.querySelectorAll("[data-testid=chat-message]"))
        return nodes.slice(0, maxMessages).map((node) => {
          const id = node.getAttribute("data-message-id") ?? crypto.randomUUID()
          const author = node.querySelector("[data-testid=chat-author]")?.textContent ?? "Unknown"
          const body = node.querySelector("[data-testid=chat-body]")?.textContent ?? ""
          const timestamp = node.querySelector("time")?.getAttribute("datetime") ?? new Date().toISOString()
          return {
            id,
            authorId: author,
            authorName: author,
            message: body,
            createdAt: timestamp,
          }
        })
      }, limit)
      return chat
    } catch (error) {
      console.warn("[SleeperLeagueImporter] chat scrape failed", error)
      return []
    }
  }

  private async captureSettingsScreenshot(page: Page, path: string) {
    try {
      await page.click('a[href$="/settings"]', { timeout: 5000 })
      await page.waitForLoadState("networkidle")
      await page.screenshot({ path, fullPage: true })
    } catch (error) {
      console.warn("[SleeperLeagueImporter] settings screenshot failed", error)
    }
  }

  private async captureChatScreenshot(page: Page, path: string) {
    try {
      await page.click('a[href$="/chat"]', { timeout: 5000 })
      await page.waitForSelector("[data-testid=chat-message]", { timeout: 5000 })
      await page.screenshot({ path, fullPage: true })
    } catch (error) {
      console.warn("[SleeperLeagueImporter] chat screenshot failed", error)
    }
  }
}

function mergeChat(apiChat: SleeperChatMessage[], webChat: SleeperChatMessage[]): SleeperChatMessage[] {
  const merged = [...apiChat]
  const existingIds = new Set(apiChat.map((message) => message.id))
  for (const message of webChat) {
    if (!existingIds.has(message.id)) {
      merged.push(message)
    }
  }
  return merged.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
}
