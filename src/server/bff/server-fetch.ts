import { cookies, headers } from 'next/headers'
import { refreshSessionWithSingleFlight } from '@/server/bff/auth-flow'
import { forwardToSpring } from '@/server/bff/spring-client'
import { getServerEnv } from '@/server/config/env'
import {
  deleteSession,
  getSession,
  parseIsoToMs,
  touchSession,
} from '@/server/session/store'

const UNAUTHORIZED_STATUS = 401

export class ServerFetchError extends Error {
  status: number

  constructor(status: number, message = `Server fetch failed: ${status}`) {
    super(message)
    this.name = 'ServerFetchError'
    this.status = status
  }
}

async function buildRequestHeaders(): Promise<Headers> {
  const incomingHeaders = await headers()
  const requestHeaders = new Headers()

  for (const name of [
    'accept',
    'accept-language',
    'x-request-id',
    'user-agent',
  ]) {
    const value = incomingHeaders.get(name)
    if (value) {
      requestHeaders.set(name, value)
    }
  }

  requestHeaders.set('content-type', 'application/json')
  if (!requestHeaders.has('accept')) {
    requestHeaders.set('accept', 'application/json')
  }

  return requestHeaders
}

/**
 * RSC에서 홈 SSR 데이터를 가져올 때 BFF와 같은 인증 의미를 유지한다.
 */
export async function serverFetch(
  apiPath: string,
  search: string = ''
): Promise<Response> {
  const cookieStore = await cookies()
  const requestHeaders = await buildRequestHeaders()
  const sessionId = cookieStore.get('sessionId')?.value ?? null
  const session = sessionId ? await getSession(sessionId) : null

  if (!sessionId || !session) {
    throw new ServerFetchError(UNAUTHORIZED_STATUS, 'Unauthorized')
  }

  const env = getServerEnv()
  const issuedAtMs = parseIsoToMs(session.issuedAt)
  const maxLifetimeMs = env.maxSessionLifetime * 1000

  if (!issuedAtMs || Date.now() - issuedAtMs > maxLifetimeMs) {
    await deleteSession(sessionId)
    throw new ServerFetchError(UNAUTHORIZED_STATUS, 'Unauthorized')
  }

  let activeSession = session
  let response = await forwardToSpring({
    apiPath,
    search,
    method: 'GET',
    requestHeaders,
    accessToken: activeSession.accessToken,
  })

  if (response.status === UNAUTHORIZED_STATUS) {
    const lastRotatedAtMs = parseIsoToMs(activeSession.lastRotatedAt)
    const minRotationIntervalMs = env.minRotationInterval * 1000

    if (
      !lastRotatedAtMs ||
      Date.now() - lastRotatedAtMs < minRotationIntervalMs
    ) {
      await deleteSession(sessionId)
      throw new ServerFetchError(UNAUTHORIZED_STATUS, 'Unauthorized')
    }

    const refreshedSession = await refreshSessionWithSingleFlight(
      sessionId,
      activeSession
    )

    if (!refreshedSession) {
      await deleteSession(sessionId)
      throw new ServerFetchError(UNAUTHORIZED_STATUS, 'Unauthorized')
    }

    activeSession = refreshedSession
    response = await forwardToSpring({
      apiPath,
      search,
      method: 'GET',
      requestHeaders,
      accessToken: activeSession.accessToken,
    })
  }

  if (response.status === UNAUTHORIZED_STATUS) {
    await deleteSession(sessionId)
    throw new ServerFetchError(UNAUTHORIZED_STATUS, 'Unauthorized')
  }

  if (response.ok) {
    await touchSession(sessionId)
  }

  return response
}
