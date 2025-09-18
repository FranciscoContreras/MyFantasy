import { NextResponse } from "next/server"

import { getSampleEspnLeagueImport } from "@/lib/league-importers/espn/sample"

export async function GET() {
  // Placeholder response. In production this route should trigger the Playwright importer
  // (lib/league-importers/espn/automation.ts) via a background job and return the persisted result.
  const sample = getSampleEspnLeagueImport()
  return NextResponse.json(sample)
}
