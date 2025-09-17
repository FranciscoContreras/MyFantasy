import Redis from "ioredis"

const REDIS_URL = process.env.REDIS_URL
const REDIS_TLS_URL = process.env.REDIS_TLS_URL

let redisClient: Redis | null = null

function createRedisClient() {
  const url = REDIS_TLS_URL || REDIS_URL
  if (!url) {
    throw new Error("Redis URL not configured")
  }

  if (REDIS_TLS_URL) {
    return new Redis(REDIS_TLS_URL, {
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  return new Redis(url)
}

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = createRedisClient()
  }
  return redisClient
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}

export function isRedisEnabled() {
  return Boolean(REDIS_URL || REDIS_TLS_URL)
}

