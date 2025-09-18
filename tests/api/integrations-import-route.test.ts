import { POST } from "@/app/api/integrations/import/route"

describe("POST /api/integrations/import", () => {
  it("validates required params", async () => {
    const request = new Request("http://localhost/api/integrations/import", {
      method: "POST",
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
    const payload = (await response.json()) as { error: string }
    expect(payload.error).toContain("Missing")
  })

  it("detects platform and returns normalized sample", async () => {
    const request = new Request("http://localhost/api/integrations/import", {
      method: "POST",
      body: JSON.stringify({ source: "https://fantasy.espn.com/football/team?leagueId=1234&season=2024" }),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)

    const payload = (await response.json()) as {
      detection: { platform: string; confidence: number }
      normalized: { platform: string; rosters: unknown[] }
    }

    expect(payload.detection.platform).toBe("espn")
    expect(payload.detection.confidence).toBeGreaterThan(0)
    expect(payload.normalized.platform).toBe("espn")
    expect(payload.normalized.rosters.length).toBeGreaterThan(0)
  })
})
