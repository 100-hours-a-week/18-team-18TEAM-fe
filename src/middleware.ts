import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/kakao/callback']

export function middleware(request: NextRequest) {
  // 개발 환경에서는 인증 체크 스킵 (로그인 테스트 시 주석 처리)
  // if (process.env.NODE_ENV === 'development') {
  //   return NextResponse.next()
  // }

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // 인증이 필요한 페이지에 토큰 없이 접근 시 로그인 페이지로 리다이렉트
  if (!isPublicRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 이미 로그인된 상태에서 로그인 페이지 접근 시 홈으로 리다이렉트
  if (pathname === '/login' && accessToken) {
    const homeUrl = new URL('/home', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons).*)'],
}
