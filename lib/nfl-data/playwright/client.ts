import { NFLDataError } from "@/lib/nfl-data/errors"

import type {
  PlaywrightCommandContext,
  PlaywrightCommandInput,
  PlaywrightCommandResult,
} from "./types"

export interface PlaywrightTransport {
  execute<T>(command: PlaywrightCommandInput, context: PlaywrightCommandContext): Promise<PlaywrightCommandResult<T>>
}

export class PlaywrightMCPClient {
  constructor(private transport?: PlaywrightTransport) {}

  async run<T>(command: PlaywrightCommandInput, context: PlaywrightCommandContext): Promise<PlaywrightCommandResult<T>> {
    if (!this.transport) {
      throw new NFLDataError("Playwright MCP transport not configured", {
        code: "NOT_IMPLEMENTED",
        meta: {
          command,
          context,
        },
      })
    }

    return this.transport.execute<T>(command, context)
  }
}

export class LoggingPlaywrightTransport implements PlaywrightTransport {
  async execute<T>(command: PlaywrightCommandInput, context: PlaywrightCommandContext): Promise<PlaywrightCommandResult<T>> {
    console.info("[PlaywrightMCP] command", { command, context })
    throw new NFLDataError("Playwright transport should be replaced with MCP integration", {
      code: "NOT_IMPLEMENTED",
      meta: { commandName: command.name },
    })
  }
}

