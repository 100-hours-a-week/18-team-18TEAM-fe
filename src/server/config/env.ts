export interface ServerEnv {
  springApiBaseUrl: string
  redisUrl: string
  redisNamespace: string
  sessionCookieSecure: boolean

  sessionTtlSeconds: number
  maxSessionLifetime: number
  minRotationInterval: number
}

const DEFAULT_REDIS_NAMESPACE = 'caro:local'
// sliding
const DEFAULT_SESSION_TTL_SECONDS = 2 * 60 * 60 // 2h

// absolute
const DEFAULT_MAX_SESSION_LIFETIME = 7 * 24 * 60 * 60 // 7d

// rotation
const DEFAULT_MIN_ROTATION_INTERVAL = 5 // seconds

function readBoolean(
  value: string | undefined,
  fallback: boolean
): boolean {
  if (!value) return fallback
  return value.toLowerCase() === 'true'
}

function readPositiveInt(
  value: string | undefined,
  fallback: number
): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return parsed
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

export function getServerEnv(): ServerEnv {
  const springApiBaseUrl =
    process.env.SPRING_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || ''

  if (!springApiBaseUrl) {
    throw new Error(
      'SPRING_API_BASE_URL (or NEXT_PUBLIC_API_URL fallback) is required for BFF routes.'
    )
  }

  const redisUrl = process.env.REDIS_URL || ''
  if (!redisUrl) {
    throw new Error('REDIS_URL is required for BFF session storage.')
  }

  return {
    springApiBaseUrl: trimTrailingSlash(springApiBaseUrl),
    redisUrl,
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
  }
}
