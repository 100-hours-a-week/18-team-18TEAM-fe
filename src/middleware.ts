import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
  '/login',
  '/kakao/callback',
  '/result',
  '/invitation',
  '/health',
]
const LOCAL_HOSTS = ['localhost', '127.0.0.1']
const SESSION_COOKIE_NAME = 'sessionId'

export function middleware(request: NextRequest) {
  const { hostname, pathname, searchParams } = request.nextUrl

  // 로컬 개발 환경에서는 미들웨어 패스
  if (LOCAL_HOSTS.includes(hostname)) {
    return NextResponse.next()
  }

  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (!isPublicRoute && !sessionId) {
    const url = new URL('/login', request.url)
    url.searchParams.set(
      'next',
      pathname + (searchParams ? `?${searchParams}` : '')
    )
    return NextResponse.redirect(url)
  }

  if (pathname === '/login' && sessionId) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons).*)'],
}
