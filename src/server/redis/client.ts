import Redis from 'ioredis'
import { getServerEnv } from '@/server/config/env'

declare global {
  // eslint-disable-next-line no-var
  var __caroRedisClient: Redis | undefined
}

function createRedisClient(): Redis {
  const env = getServerEnv()
  const commonOptions = {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: false,
  }

  if (env.redisMode === 'sentinel') {
    return new Redis({
      ...commonOptions,
      sentinels: env.redisSentinelNodes,
      name: env.redisMasterName,
      password: env.redisPassword,
      db: 0,
    })
  }

  return new Redis(env.redisUrl, commonOptions)
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

const RELEASE_LOCK_IF_OWNER_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0
`

export async function redisSetNxPx(
  key: string,
  value: string,
  ttlMs: number
): Promise<boolean> {
  const result = await getRedisClient().set(key, value, 'PX', ttlMs, 'NX')
  return result === 'OK'
}

export async function redisReleaseLockIfOwner(
  key: string,
  owner: string
): Promise<boolean> {
  const result = await getRedisClient().eval(
    RELEASE_LOCK_IF_OWNER_SCRIPT,
    1,
    key,
    owner
  )
  return Number(result) === 1
}
