import { NextResponse } from "next/server"

import { detectPlatform } from "@/lib/league-importers/universal/detect"
import { normalizeSample } from "@/lib/league-importers/universal/handler"
import type { SupportedPlatform } from "@/lib/league-importers/universal/types"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    source?: string
    platform?: SupportedPlatform
  }

  if (!body.source && !body.platform) {
    return NextResponse.json(
      {
        error: "Missing source or platform",
      },
      { status: 400 },
    )
  }

  const detection = body.platform ? { platform: body.platform, confidence: 1 } : detectPlatform(body.source ?? "")
  const normalized = normalizeSample(detection.platform)

  return NextResponse.json({ detection, normalized, note: "Placeholder response; wire up runUniversalImport for real data." })
}
