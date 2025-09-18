import { getSampleCbsLeagueImport } from "@/lib/league-importers/cbs/sample"
import type { CbsLeagueImportResult } from "@/lib/league-importers/cbs/types"

export interface CbsImporterOptions {
  leagueUrl: string
}

export class CbsLeagueImporter {
  constructor(private readonly _options: CbsImporterOptions) {}

  async run(): Promise<CbsLeagueImportResult> {
    return getSampleCbsLeagueImport()
  }
}
