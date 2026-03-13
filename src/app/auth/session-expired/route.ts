import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/server/session/cookie'
import { deleteSession } from '@/server/session/store'

export async function GET(request: NextRequest) {
  const nextPath = request.nextUrl.searchParams.get('next') || '/home'
  const sessionId = request.cookies.get('sessionId')?.value || null

  if (sessionId) {
    await deleteSession(sessionId)
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', nextPath)

  const response = NextResponse.redirect(loginUrl)
  clearSessionCookie(response)
  return response
}
