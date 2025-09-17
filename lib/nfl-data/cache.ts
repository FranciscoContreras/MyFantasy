type CacheEntry<T> = {
  value: T
  expiresAt: number
}

export class TTLCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>()

  constructor(private defaultTtlMs = 60_000) {}

  set(key: string, value: T, ttlMs = this.defaultTtlMs) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    })
  }

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  delete(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

export const nflDataCache = new TTLCache<unknown>(5 * 60_000)
