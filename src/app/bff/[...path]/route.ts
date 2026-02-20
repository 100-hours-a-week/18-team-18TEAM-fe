import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  buildSessionFingerprint,
  extractTokenPairFromBody,
  refreshSessionViaSpring,
} from '@/server/bff/auth-flow'
import {
  isInternalOnlyPath,
  resolveAuthPolicy,
  shouldSkipRefresh,
} from '@/server/bff/policy'
import {
  forwardToSpring,
  toProxyHeaders,
  type ForwardRequestBody,
} from '@/server/bff/spring-client'
import { getServerEnv } from '@/server/config/env'
import { isSameOriginMutation, isSafeMethod } from '@/server/security/csrf'
import {
  clearSessionCookie,
  createSessionId,
  getSessionId,
  issueSessionCookie,
} from '@/server/session/cookie'
import {
  createSession,
  deleteSession,
  getSession,
  parseIsoToMs,
  touchSession,
  type SessionRecord,
} from '@/server/session/store'

export const runtime = 'nodejs'

type RouteParams = { path: string[] }
type RouteContext = { params: Promise<RouteParams> | RouteParams }

function hasRequestBody(method: string): boolean {
  return !['GET', 'HEAD'].includes(method.toUpperCase())
}

function isTextBasedBody(contentType: string | null): boolean {
  if (!contentType) return false
  const normalized = contentType.toLowerCase()
  return (
    normalized.includes('application/json') ||
    normalized.includes('application/x-www-form-urlencoded') ||
    normalized.startsWith('text/')
  )
}

async function readReusableBody(
  request: NextRequest,
  method: string
): Promise<ForwardRequestBody | undefined> {
  if (!hasRequestBody(method)) return undefined

  const contentType = request.headers.get('content-type')
  if (isTextBasedBody(contentType)) {
    return request.text()
  }

  return request.arrayBuffer()
}

function jsonError(status: number, message: string): NextResponse {
  return NextResponse.json({ message }, { status })
}

async function toProxyResponse(upstream: Response): Promise<NextResponse> {
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: toProxyHeaders(upstream.headers),
  })
}

async function resolveApiPath(context: RouteContext): Promise<string> {
  const params = await Promise.resolve(context.params)
  return `/${params.path.join('/')}`
}

async function handleKakaoLogin(
  request: NextRequest,
  body: ForwardRequestBody | undefined
): Promise<NextResponse> {
  const upstream = await forwardToSpring({
    apiPath: '/auth/login/kakao',
    search: request.nextUrl.search,
    method: request.method,
    body,
    requestHeaders: request.headers,
  })

  const bodyText = await upstream.text()
  if (!upstream.ok) {
    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: toProxyHeaders(upstream.headers),
    })
  }

  const tokenPair = extractTokenPairFromBody(bodyText)
  if (!tokenPair) {
    return jsonError(
      502,
      'Failed to create a session from Kakao login response.'
    )
  }

  const now = new Date().toISOString()
  const sessionId = createSessionId()
  const fingerprint = buildSessionFingerprint(request)
  const sessionRecord: SessionRecord = {
    userId: null,
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
    issuedAt: now,
    lastRotatedAt: now,
    ...fingerprint,
  }

  await createSession(sessionId, sessionRecord)

  const response = NextResponse.json(
    { success: true },
    {
      status: upstream.status,
    }
  )
  issueSessionCookie(response, sessionId)
  return response
}

async function handleLogout(
  request: NextRequest,
  apiPath: string,
  search: string,
  sessionId: string | null,
  session: SessionRecord | null,
  body: ForwardRequestBody | undefined
): Promise<NextResponse> {
  let upstream: Response | null = null

  if (session) {
    upstream = await forwardToSpring({
      apiPath,
      search,
      method: request.method,
      body,
      requestHeaders: request.headers,
      accessToken: session.accessToken,
    })
  }

  if (sessionId) {
    await deleteSession(sessionId)
  }

  const response = upstream
    ? await toProxyResponse(upstream)
    : NextResponse.json({ success: true }, { status: 200 })

  clearSessionCookie(response)
  return response
}

async function handleProxyRequest(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const env = getServerEnv()
  const apiPath = await resolveApiPath(context)
  const search = request.nextUrl.search
  const method = request.method.toUpperCase()

  if (isInternalOnlyPath(apiPath)) {
    return jsonError(404, 'Not Found')
  }

  if (!isSafeMethod(method) && !isSameOriginMutation(request)) {
    return jsonError(403, 'Forbidden')
  }

  const body = await readReusableBody(request, method)

  const authPolicy = resolveAuthPolicy(apiPath)
  const sessionId = getSessionId(request)
  const session = sessionId ? await getSession(sessionId) : null

  if (apiPath === '/auth/login/kakao') {
    return handleKakaoLogin(request, body)
  }

  if (apiPath === '/auth/logout') {
    return handleLogout(request, apiPath, search, sessionId, session, body)
  }

  if (authPolicy === 'normal' && !session) {
    const unauthorized = jsonError(401, 'Unauthorized')
    clearSessionCookie(unauthorized)
    return unauthorized
  }

  if (authPolicy === 'normal' && sessionId && session) {
    const issuedAtMs = parseIsoToMs(session.issuedAt)
    const maxLifetimeMs = env.maxSessionLifetime * 1000

    if (!issuedAtMs || Date.now() - issuedAtMs > maxLifetimeMs) {
      await deleteSession(sessionId)
      const unauthorized = jsonError(401, 'Unauthorized')
      clearSessionCookie(unauthorized)
      return unauthorized
    }
  }

  let activeSession = session
  let upstream = await forwardToSpring({
    apiPath,
    search,
    method,
    body,
    requestHeaders: request.headers,
    accessToken: activeSession?.accessToken,
  })

  if (
    upstream.status === 401 &&
    sessionId &&
    activeSession &&
    !shouldSkipRefresh(request.headers)
  ) {
    const lastRotatedAtMs = parseIsoToMs(activeSession.lastRotatedAt)
    const minRotationIntervalMs = env.minRotationInterval * 1000
    if (
      !lastRotatedAtMs ||
      Date.now() - lastRotatedAtMs < minRotationIntervalMs
    ) {
      await deleteSession(sessionId)
      const unauthorized = await toProxyResponse(upstream)
      clearSessionCookie(unauthorized)
      return unauthorized
    }

    const refreshed = await refreshSessionViaSpring(sessionId, activeSession)
    if (!refreshed) {
      await deleteSession(sessionId)
      const unauthorized = await toProxyResponse(upstream)
      clearSessionCookie(unauthorized)
      return unauthorized
    }

    activeSession = refreshed
    upstream = await forwardToSpring({
      apiPath,
      search,
      method,
      body,
      requestHeaders: request.headers,
      accessToken: activeSession.accessToken,
    })
  }

  const response = await toProxyResponse(upstream)
  if (upstream.status === 401 && sessionId) {
    await deleteSession(sessionId)
    clearSessionCookie(response)
    return response
  }

  if (sessionId && upstream.ok) {
    try {
      await touchSession(sessionId)
    } catch {
      // 응답 성공을 깨지 않기 위해 TTL 갱신 실패는 무시한다.
    }
  }

  return response
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleProxyRequest(request, context)
}
