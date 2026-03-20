export interface RedisSentinelNode {
  host: string
  port: number
}

export type RedisConfig =
  | {
      redisMode: 'standalone'
      redisUrl: string
    }
  | {
      redisMode: 'sentinel'
      redisSentinelNodes: RedisSentinelNode[]
      redisMasterName: string
      redisPassword: string
    }

export type ServerEnv = RedisConfig & {
  springApiBaseUrl: string
  aiApiBaseUrl: string
  redisNamespace: string
  sessionCookieSecure: boolean

  sessionTtlSeconds: number
  maxSessionLifetime: number
  minRotationInterval: number
  refreshSingleFlightLockMs: number
  refreshSingleFlightWaitMs: number
  refreshSingleFlightPollMs: number
}

const DEFAULT_REDIS_NAMESPACE = 'caro:local'
// sliding
const DEFAULT_SESSION_TTL_SECONDS = 2 * 60 * 60 // 2h

// absolute
const DEFAULT_MAX_SESSION_LIFETIME = 7 * 24 * 60 * 60 // 7d

// rotation
const DEFAULT_MIN_ROTATION_INTERVAL = 5 // seconds
const DEFAULT_REFRESH_SINGLE_FLIGHT_LOCK_MS = 8000
const DEFAULT_REFRESH_SINGLE_FLIGHT_WAIT_MS = 10000
const DEFAULT_REFRESH_SINGLE_FLIGHT_POLL_MS = 100

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback
  return value.toLowerCase() === 'true'
}

function readPositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return parsed
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

function readTrimmedString(value: string | undefined): string {
  return value?.trim() ?? ''
}

function parseRedisSentinelNodes(value: string): RedisSentinelNode[] {
  const entries = value.split(',')

  if (entries.length === 0 || entries.some((entry) => entry.trim() === '')) {
    throw new Error(
      'REDIS_SENTINEL_NODES must be a comma-separated list of host:port entries.'
    )
  }

  return entries.map((entry) => {
    const trimmedEntry = entry.trim()
    const match = trimmedEntry.match(/^([^:]+):(\d+)$/)
    const port = match ? Number.parseInt(match[2], 10) : Number.NaN

    if (!match || !Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new Error(
        'REDIS_SENTINEL_NODES must be a comma-separated list of host:port entries.'
      )
    }

    return {
      host: match[1],
      port,
    }
  })
}

function readRedisConfig(): RedisConfig {
  const appStage = readTrimmedString(process.env.APP_STAGE).toLowerCase()

  if (appStage !== 'prod') {
    const redisUrl = readTrimmedString(process.env.REDIS_URL)

    if (!redisUrl) {
      throw new Error('REDIS_URL is required for BFF session storage.')
    }

    return {
      redisMode: 'standalone',
      redisUrl,
    }
  }

  const redisSentinelNodes = readTrimmedString(process.env.REDIS_SENTINEL_NODES)
  const redisMasterName = readTrimmedString(process.env.REDIS_MASTER_NAME)
  const redisPassword = readTrimmedString(process.env.REDIS_PASSWORD)

  if (!redisSentinelNodes) {
    throw new Error('REDIS_SENTINEL_NODES is required for prod BFF session storage.')
  }

  if (!redisMasterName) {
    throw new Error('REDIS_MASTER_NAME is required for prod BFF session storage.')
  }

  if (!redisPassword) {
    throw new Error('REDIS_PASSWORD is required for prod BFF session storage.')
  }

  return {
    redisMode: 'sentinel',
    redisSentinelNodes: parseRedisSentinelNodes(redisSentinelNodes),
    redisMasterName,
    redisPassword,
  }
}

export function getServerEnv(): ServerEnv {
  const springApiBaseUrl = process.env.SPRING_API_BASE_URL || ''

  if (!springApiBaseUrl) {
    throw new Error('SPRING_API_BASE_URL is required for BFF routes.')
  }

  return {
    ...readRedisConfig(),
    springApiBaseUrl: trimTrailingSlash(springApiBaseUrl),
    aiApiBaseUrl: trimTrailingSlash(process.env.AI_API_BASE_URL || ''),
    redisNamespace: process.env.REDIS_NAMESPACE || DEFAULT_REDIS_NAMESPACE,
    sessionCookieSecure: readBoolean(
      process.env.SESSION_COOKIE_SECURE,
      process.env.NODE_ENV === 'production'
    ),
    sessionTtlSeconds: readPositiveInt(
      process.env.SESSION_TTL_SECONDS,
      DEFAULT_SESSION_TTL_SECONDS
    ),
    // absolute
    maxSessionLifetime: readPositiveInt(
      process.env.MAX_SESSION_LIFETIME,
      DEFAULT_MAX_SESSION_LIFETIME
    ),

    // rotation
    minRotationInterval: readPositiveInt(
      process.env.MIN_ROTATION_INTERVAL,
      DEFAULT_MIN_ROTATION_INTERVAL
    ),

    refreshSingleFlightLockMs: readPositiveInt(
      process.env.REFRESH_SINGLE_FLIGHT_LOCK_MS,
      DEFAULT_REFRESH_SINGLE_FLIGHT_LOCK_MS
    ),
    refreshSingleFlightWaitMs: readPositiveInt(
      process.env.REFRESH_SINGLE_FLIGHT_WAIT_MS,
      DEFAULT_REFRESH_SINGLE_FLIGHT_WAIT_MS
    ),
    refreshSingleFlightPollMs: readPositiveInt(
      process.env.REFRESH_SINGLE_FLIGHT_POLL_MS,
      DEFAULT_REFRESH_SINGLE_FLIGHT_POLL_MS
    ),
  }
}
