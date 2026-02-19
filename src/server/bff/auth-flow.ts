import { createHash } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { forwardToSpring } from '@/server/bff/spring-client'
import type { SessionRecord } from '@/server/session/store'
import { updateSessionTokens } from '@/server/session/store'

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
