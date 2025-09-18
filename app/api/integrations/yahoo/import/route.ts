import { NextResponse } from "next/server"

import { getSampleYahooLeagueImport } from "@/lib/league-importers/yahoo/sample"

export async function GET() {
  // Placeholder response. Replace with background job invocation that calls the Yahoo importer
  // (lib/league-importers/yahoo/automation.ts) and persists the result.
  const sample = getSampleYahooLeagueImport()
  return NextResponse.json(sample)
}
