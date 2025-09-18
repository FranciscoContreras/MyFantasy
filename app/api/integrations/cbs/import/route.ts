import { NextResponse } from "next/server"

import { getSampleCbsLeagueImport } from "@/lib/league-importers/cbs/sample"

export async function GET() {
  // Placeholder response; replace with Playwright automation run and persisted result
  const sample = getSampleCbsLeagueImport()
  return NextResponse.json(sample)
}
