import { randomUUID } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getServerEnv } from '@/server/config/env'

const SESSION_COOKIE_NAME = 'sessionId'

export function getSessionId(request: NextRequest): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null
}

export function issueSessionCookie(
  response: NextResponse,
  sessionId: string
): void {
  const env = getServerEnv()
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    secure: env.sessionCookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: env.sessionTtlSeconds,
  })
}

export function clearSessionCookie(response: NextResponse): void {
  const env = getServerEnv()
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: env.sessionCookieSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function createSessionId(): string {
  return randomUUID()
}
