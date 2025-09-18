import { getSampleYahooLeagueImport } from "@/lib/league-importers/yahoo/sample"
import type { YahooLeagueImportResult } from "@/lib/league-importers/yahoo/types"

export interface YahooImporterOptions {
  leagueKey: string
}

export class YahooLeagueImporter {
  constructor(private readonly _options: YahooImporterOptions) {}

  async run(): Promise<YahooLeagueImportResult> {
    return getSampleYahooLeagueImport()
  }
}
