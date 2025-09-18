import { NextResponse } from "next/server"

import { getSampleSleeperLeagueImport } from "@/lib/league-importers/sleeper/sample"

export async function GET() {
  // Placeholder response; replace with execution of the hybrid importer and persisted result.
  const sample = getSampleSleeperLeagueImport()
  return NextResponse.json(sample)
}
