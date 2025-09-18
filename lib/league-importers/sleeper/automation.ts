import { getSampleSleeperLeagueImport } from "@/lib/league-importers/sleeper/sample"
import type { SleeperLeagueImportResult } from "@/lib/league-importers/sleeper/types"

export interface SleeperImporterOptions {
  leagueId: string
}

export class SleeperLeagueImporter {
  constructor(private readonly _options: SleeperImporterOptions) {}

  async run(): Promise<SleeperLeagueImportResult> {
    return getSampleSleeperLeagueImport()
  }
}
