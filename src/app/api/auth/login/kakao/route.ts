import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { code } = await request.json()

  // [DEBUG] 백엔드 요청 정보 로그
  console.log('=== Kakao Login Debug ===')
  console.log(
    'Backend URL:',
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login/kakao`
  )
  console.log('Authorization Code:', code)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login/kakao`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }
  )

  // [DEBUG] 백엔드 응답 상태 로그
  console.log('Backend Response Status:', res.status)

  if (!res.ok) {
    // [DEBUG] 백엔드 에러 내용 로그
    const errorText = await res.text()
    console.log('Backend Error:', errorText)
    return NextResponse.json(
      { error: 'Login failed', detail: errorText },
      { status: res.status }
    )
  }

  const data = await res.json()

  const cookieStore = await cookies()
  cookieStore.set('accessToken', data.access_token, {
    httpOnly: false, // 클라이언트 axios 인터셉터에서 읽어 Authorization 헤더로 전달
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // 액세스 토큰 유효기간(백엔드 30분)과 동일하게 세션을 끊어 만료된 토큰이 쿠키에 남지 않도록 한다
    maxAge: 30 * 60,
  })

  return NextResponse.json({
    success: true,
    accessToken: data.access_token,
  })
}
