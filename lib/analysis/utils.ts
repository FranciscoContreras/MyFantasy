export function clamp(value: number, min = 0, max = 1) {
  if (Number.isNaN(value)) {
    return min
  }
  return Math.min(max, Math.max(min, value))
}

export function safeAverage(values: number[]) {
  const filtered = values.filter((v) => Number.isFinite(v))
  if (!filtered.length) {
    return 0
  }
  const total = filtered.reduce((sum, value) => sum + value, 0)
  return total / filtered.length
}

export function normalize(value: number, min: number, max: number) {
  if (max === min) {
    return 0
  }
  return clamp((value - min) / (max - min))
}

export function inverseNormalize(value: number, min: number, max: number) {
  return 1 - normalize(value, min, max)
}

export function roundTo(value: number, digits = 3) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

