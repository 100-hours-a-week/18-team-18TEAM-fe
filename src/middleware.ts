import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/kakao/callback', '/result', '/invitation']
const LOCAL_HOSTS = ['localhost', '127.0.0.1']

export function middleware(request: NextRequest) {
  const { hostname, pathname, searchParams } = request.nextUrl

  // 로컬 개발 환경에서는 미들웨어 패스
  if (LOCAL_HOSTS.includes(hostname)) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (!isPublicRoute && !accessToken && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set(
      'next',
      pathname + (searchParams ? `?${searchParams}` : '')
    )
    return NextResponse.redirect(url)
    // return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && accessToken) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons).*)'],
}
