import { getRedis, isRedisEnabled } from "@/lib/cache"

interface CachePutOptions {
  ttlSeconds?: number
  tags?: string[]
}

const DEFAULT_TTL_SECONDS = 60 * 5 // 5 minutes

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!isRedisEnabled()) {
    return null
  }

  const redis = getRedis()
  const data = await redis.get(key)
  if (!data) {
    return null
  }

  try {
    return JSON.parse(data) as T
  } catch (error) {
    console.warn(`[cache] failed to parse value for ${key}`, error)
    return null
  }
}

export async function cachePut<T>(key: string, value: T, options: CachePutOptions = {}): Promise<void> {
  if (!isRedisEnabled()) {
    return
  }

  const redis = getRedis()
  const ttl = options.ttlSeconds ?? DEFAULT_TTL_SECONDS

  await redis.set(key, JSON.stringify(value), "EX", ttl)

  if (options.tags?.length) {
    await Promise.all(
      options.tags.map((tag) => redis.sadd(cacheTagKey(tag), key)),
    )
  }
}

export async function cacheInvalidateByTag(tag: string) {
  if (!isRedisEnabled()) {
    return
  }

  const redis = getRedis()
  const members = await redis.smembers(cacheTagKey(tag))
  if (!members.length) {
    return
  }

  const pipeline = redis.pipeline()
  members.forEach((member) => pipeline.del(member))
  pipeline.del(cacheTagKey(tag))
  await pipeline.exec()
}

export function cacheKey(parts: Array<string | number | undefined | null>) {
  return parts.filter((part) => part !== undefined && part !== null).join(":")
}

function cacheTagKey(tag: string) {
  return `tag:${tag}`
}

