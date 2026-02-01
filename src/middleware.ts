import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/kakao/callback']
const LOCAL_HOSTS = ['localhost', '127.0.0.1']

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl

  // 로컬 개발 환경에서는 미들웨어 패스
  if (LOCAL_HOSTS.includes(hostname)) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && accessToken) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons).*)'],
}
