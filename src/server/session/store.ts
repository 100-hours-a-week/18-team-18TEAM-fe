import { getServerEnv } from '@/server/config/env'
import { redisDel, redisExpire, redisGet, redisSetEx } from '@/server/redis/client'

export interface SessionRecord {
  userId: number | string | null
  accessToken: string
  refreshToken: string
  issuedAt: string
  lastRotatedAt: string
  userAgentHash?: string
  ipHash?: string
}

export function parseIsoToMs(value: string): number | null {
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return null
  return parsed
}

function buildSessionKey(sessionId: string): string {
  const { redisNamespace } = getServerEnv()
  return `${redisNamespace}:session:${sessionId}`
}

function isSessionRecord(value: unknown): value is SessionRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.accessToken === 'string' &&
    typeof record.refreshToken === 'string' &&
    typeof record.issuedAt === 'string' &&
    typeof record.lastRotatedAt === 'string'
  )
}

export async function createSession(
  sessionId: string,
  record: SessionRecord
): Promise<void> {
  const { sessionTtlSeconds } = getServerEnv()
  await redisSetEx(buildSessionKey(sessionId), sessionTtlSeconds, JSON.stringify(record))
}

export async function getSession(
  sessionId: string
): Promise<SessionRecord | null> {
  const raw = await redisGet(buildSessionKey(sessionId))
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!isSessionRecord(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export async function touchSession(sessionId: string): Promise<void> {
  const { sessionTtlSeconds } = getServerEnv()
  await redisExpire(buildSessionKey(sessionId), sessionTtlSeconds)
}

export async function updateSessionTokens(
  sessionId: string,
  accessToken: string,
  refreshToken: string
): Promise<SessionRecord | null> {
  const existing = await getSession(sessionId)
  if (!existing) return null

  const updated: SessionRecord = {
    ...existing,
    accessToken,
    refreshToken,
    lastRotatedAt: new Date().toISOString(),
  }

  await createSession(sessionId, updated)
  return updated
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redisDel(buildSessionKey(sessionId))
}
