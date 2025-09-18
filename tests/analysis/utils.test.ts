import { clamp, safeAverage, normalize, inverseNormalize, roundTo } from "@/lib/analysis/utils"

describe("analysis utils", () => {
  it("clamps values within provided range", () => {
    expect(clamp(1.5)).toBe(1)
    expect(clamp(-0.2)).toBe(0)
    expect(clamp(0.75)).toBe(0.75)
    expect(clamp(42, 10, 50)).toBe(42)
    expect(clamp(9, 10, 50)).toBe(10)
  })

  it("computes safe averages ignoring invalid numbers", () => {
    expect(safeAverage([1, 2, 3])).toBeCloseTo(2)
    expect(safeAverage([Number.NaN, 4, 8])).toBeCloseTo(6)
    expect(safeAverage([Infinity, -Infinity])).toBe(0)
    expect(safeAverage([])).toBe(0)
  })

  it("normalizes values between 0 and 1", () => {
    expect(normalize(5, 0, 10)).toBeCloseTo(0.5)
    expect(normalize(10, 0, 10)).toBeCloseTo(1)
    expect(normalize(-5, 0, 10)).toBeCloseTo(0)
    expect(normalize(3, 3, 3)).toBe(0)
  })

  it("inverts normalized values", () => {
    expect(inverseNormalize(5, 0, 10)).toBeCloseTo(0.5)
    expect(inverseNormalize(0, 0, 10)).toBeCloseTo(1)
    expect(inverseNormalize(10, 0, 10)).toBeCloseTo(0)
  })

  it("rounds numbers to given precision", () => {
    expect(roundTo(1.23456)).toBe(1.235)
    expect(roundTo(9.8765, 2)).toBe(9.88)
    expect(roundTo(0.0049, 2)).toBe(0)
  })
})
