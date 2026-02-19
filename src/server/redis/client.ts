import Redis from 'ioredis'
import { getServerEnv } from '@/server/config/env'

declare global {
  // eslint-disable-next-line no-var
  var __caroRedisClient: Redis | undefined
}

function createRedisClient(): Redis {
  const { redisUrl } = getServerEnv()

  return new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: false,
  })
}

export function getRedisClient(): Redis {
  if (!globalThis.__caroRedisClient) {
    globalThis.__caroRedisClient = createRedisClient()
  }
  return globalThis.__caroRedisClient
}

export async function redisGet(key: string): Promise<string | null> {
  return getRedisClient().get(key)
}

export async function redisSetEx(
  key: string,
  ttlSeconds: number,
  value: string
): Promise<void> {
  await getRedisClient().set(key, value, 'EX', ttlSeconds)
}

export async function redisExpire(
  key: string,
  ttlSeconds: number
): Promise<void> {
  await getRedisClient().expire(key, ttlSeconds)
}

export async function redisDel(key: string): Promise<number> {
  return getRedisClient().del(key)
}
