import { getSampleEspnLeagueImport } from "@/lib/league-importers/espn/sample"
import type { EspnLeagueImportResult } from "@/lib/league-importers/espn/types"

export interface EspnImporterOptions {
  leagueId: string
  season: number
}

export class EspnLeagueImporter {
  constructor(private readonly _options: EspnImporterOptions) {}

  async run(): Promise<EspnLeagueImportResult> {
    return getSampleEspnLeagueImport()
  }
}
