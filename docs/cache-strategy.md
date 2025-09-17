# Data Caching Strategy

NFL data access uses a two-tier cache so we can keep API calls low while still serving fresh data when needed.

## Layers

1. **In-memory TTL cache (`lib/nfl-data/cache.ts`)** – Fast, per-instance storage with a default 5-minute TTL. Disabled automatically when a fetch is forced with `context.reason` containing `refresh`.
2. **Redis cache (`lib/nfl-data/cache-strategy.ts`)** – Optional network cache shared across instances. Keys are deterministic via `cacheKey([...parts])`, and tag invalidation is supported through `cacheInvalidateByTag`.

If Redis environment variables (`REDIS_URL` or `REDIS_TLS_URL`) are unset, the system falls back to the in-memory cache only. Errors encountered while reading or writing to Redis are logged and ignored so downstream calls are never blocked.

## Usage

```ts
import { cacheKey } from "@/lib/nfl-data/cache-strategy"

const key = cacheKey(["schedule", season, week])
const games = await nflDataService.fetchSchedule({ season, week }, {
  requestId: "dashboard-schedule",
  ttlMs: 2 * 60 * 1000, // override TTL to 2 minutes if desired
})
```

To clear related entries (e.g., when we detect a stat correction), call:

```ts
await cacheInvalidateByTag("player-stats:week-5")
```

## Redis Setup

Set `REDIS_URL` in `.env` once a Redis instance is available. Leave it blank during local development to avoid connection attempts. For TLS-protected hosts, use `REDIS_TLS_URL` instead.

```env
REDIS_URL="redis://localhost:6379"
# or
REDIS_TLS_URL="rediss://..."
```

Run-time logging will surface cache misses or Redis failures prefixed with `NFLDataService:cache` so we can monitor behaviour.
