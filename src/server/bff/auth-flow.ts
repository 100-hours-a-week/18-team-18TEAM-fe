import { createHash, randomUUID } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { forwardToSpring } from '@/server/bff/spring-client'
import { getServerEnv } from '@/server/config/env'
import { redisReleaseLockIfOwner, redisSetNxPx } from '@/server/redis/client'
import type { SessionRecord } from '@/server/session/store'
import { getSession, updateSessionTokens } from '@/server/session/store'

interface TokenPair {
  accessToken: string
  refreshToken: string
}

export function extractTokenPairFromBody(bodyText: string): TokenPair | null {
  try {
    const parsed = JSON.parse(bodyText) as {
      accessToken?: unknown
      refreshToken?: unknown
      data?: {
        accessToken?: unknown
        refreshToken?: unknown
      }
    }

    const nestedData = parsed.data
    if (
      nestedData &&
      typeof nestedData.accessToken === 'string' &&
      nestedData.accessToken &&
      typeof nestedData.refreshToken === 'string' &&
      nestedData.refreshToken
    ) {
      return {
        accessToken: nestedData.accessToken,
        refreshToken: nestedData.refreshToken,
      }
    }

    if (
      typeof parsed.accessToken === 'string' &&
      parsed.accessToken &&
      typeof parsed.refreshToken === 'string' &&
      parsed.refreshToken
    ) {
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      }
    }

    return null
  } catch {
    return null
  }
}

function toSha256(value: string | null): string | undefined {
  if (!value) return undefined
  return createHash('sha256').update(value).digest('hex')
}

function buildRefreshLockKey(sessionId: string): string {
  const { redisNamespace } = getServerEnv()
  return `${redisNamespace}:refresh-lock:${sessionId}`
}

function hasSessionRotated(
  staleSession: SessionRecord,
  latestSession: SessionRecord
): boolean {
  return (
    staleSession.accessToken !== latestSession.accessToken ||
    staleSession.refreshToken !== latestSession.refreshToken ||
    staleSession.lastRotatedAt !== latestSession.lastRotatedAt
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function buildSessionFingerprint(
  request: NextRequest
): Pick<SessionRecord, 'userAgentHash' | 'ipHash'> {
  const userAgent = request.headers.get('user-agent')
  const forwardedFor = request.headers.get('x-forwarded-for')
  const firstIp = forwardedFor?.split(',')[0]?.trim() || null

  return {
    userAgentHash: toSha256(userAgent),
    ipHash: toSha256(firstIp),
  }
}

export async function refreshSessionViaSpring(
  sessionId: string,
  session: SessionRecord
): Promise<SessionRecord | null> {
  const rotationPayload = JSON.stringify({
    refreshToken: session.refreshToken,
  })

  const response = await forwardToSpring({
    apiPath: '/auth/rotation',
    search: '',
    method: 'POST',
    requestHeaders: new Headers({
      'content-type': 'application/json',
    }),
    body: rotationPayload,
  })

  if (!response.ok) {
    return null
  }

  const bodyText = await response.text()
  const nextTokenPair = extractTokenPairFromBody(bodyText)
  if (!nextTokenPair) return null

  return updateSessionTokens(
    sessionId,
    nextTokenPair.accessToken,
    nextTokenPair.refreshToken
  )
}

export async function refreshSessionWithSingleFlight(
  sessionId: string,
  staleSession: SessionRecord
): Promise<SessionRecord | null> {
  const env = getServerEnv()
  const lockKey = buildRefreshLockKey(sessionId)
  const deadline = Date.now() + env.refreshSingleFlightWaitMs

  while (Date.now() < deadline) {
    const latestSession = await getSession(sessionId)
    if (!latestSession) return null

    if (hasSessionRotated(staleSession, latestSession)) {
      return latestSession
    }

    const lockOwner = randomUUID()
    const acquired = await redisSetNxPx(
      lockKey,
      lockOwner,
      env.refreshSingleFlightLockMs
    )

    if (acquired) {
      try {
        const currentSession = await getSession(sessionId)
        if (!currentSession) return null

        if (hasSessionRotated(staleSession, currentSession)) {
          return currentSession
        }

        const refreshedSession = await refreshSessionViaSpring(
          sessionId,
          currentSession
        )
        return refreshedSession
      } finally {
        try {
          await redisReleaseLockIfOwner(lockKey, lockOwner)
        } catch {
          // 락 해제 실패는 다음 요청에서 TTL 만료로 복구된다.
        }
      }
    }

    await sleep(env.refreshSingleFlightPollMs)
  }

  const latestSession = await getSession(sessionId)
  if (!latestSession) return null

  if (hasSessionRotated(staleSession, latestSession)) {
    return latestSession
  }

  return null
}
