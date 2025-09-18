import { PlayerAnalysisEngine } from "@/lib/analysis/engine"
import type { NFLDataService } from "@/lib/nfl-data"
import type { GameSchedule, InjuryReport, PlayerStat, TeamDefenseStat, WeatherReport } from "@/lib/nfl-data/types"

const mockStatsCurrent: PlayerStat[] = [
  { playerId: "4035687", name: "Justin Jefferson", team: "MIN", position: "WR", season: 2024, week: 6, points: 24.1, stats: {}, source: "mock" },
  { playerId: "4035687", name: "Justin Jefferson", team: "MIN", position: "WR", season: 2024, week: 7, points: 19.8, stats: {}, source: "mock" },
  { playerId: "4035687", name: "Justin Jefferson", team: "MIN", position: "WR", season: 2024, week: 8, points: 27.3, stats: {}, source: "mock" },
]

const mockStatsPrevious: PlayerStat[] = [
  { playerId: "4035687", name: "Justin Jefferson", team: "MIN", position: "WR", season: 2023, week: 16, points: 21.4, stats: {}, source: "mock" },
  { playerId: "4035687", name: "Justin Jefferson", team: "MIN", position: "WR", season: 2023, week: 17, points: 23.9, stats: {}, source: "mock" },
]

const mockDefense: TeamDefenseStat[] = [
  { teamId: "GB", season: 2024, week: 9, rank: 12, pointsAllowed: 21.3, yardsAllowed: 340, turnovers: 1.2, source: "mock" },
]

const mockSchedule: GameSchedule[] = [
  {
    gameId: "game-123",
    season: 2024,
    week: 9,
    startTime: new Date().toISOString(),
    stadium: "US Bank Stadium",
    homeTeamId: "MIN",
    awayTeamId: "GB",
    network: "ESPN",
    status: "scheduled",
  },
]

const mockInjuries: InjuryReport[] = [
  { playerId: "3117257", teamId: "MIN", status: "QUESTIONABLE", updatedAt: new Date().toISOString(), source: "mock", designation: "Limited", description: "Shoulder" },
]

const mockWeather: WeatherReport = {
  gameId: "game-123",
  temperature: 68,
  windSpeed: 5,
  precipitationChance: 10,
  condition: "Clear",
  updatedAt: new Date().toISOString(),
  source: "mock",
}

describe("PlayerAnalysisEngine", () => {
  const mockService: jest.Mocked<Pick<NFLDataService, "fetchPlayerStats" | "fetchTeamDefense" | "fetchSchedule" | "fetchInjuryReports" | "fetchWeatherData">> = {
    fetchPlayerStats: jest.fn(async ({ season }) => (season === 2024 ? mockStatsCurrent : mockStatsPrevious)),
    fetchTeamDefense: jest.fn(async () => mockDefense),
    fetchSchedule: jest.fn(async () => mockSchedule),
    fetchInjuryReports: jest.fn(async () => mockInjuries),
    fetchWeatherData: jest.fn(async () => [mockWeather]),
  }

  const engine = new PlayerAnalysisEngine(mockService as unknown as NFLDataService)

  it("returns composite scores with actionable notes", async () => {
    const result = await engine.analyzePlayer({
      playerId: "4035687",
      season: 2024,
      week: 9,
      teamId: "MIN",
      position: "WR",
    })

    expect(result.compositeScore).toBeGreaterThan(0)
    expect(result.compositeScore).toBeLessThanOrEqual(1)
    expect(result.recommendation).toMatch(/start|flex|bench/)
    expect(result.notes.length).toBeGreaterThan(0)
    expect(mockService.fetchWeatherData).toHaveBeenCalledWith({ gameIds: ["game-123"] }, expect.any(Object))
  })
})
