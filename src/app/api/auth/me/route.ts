import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const headerToken = authHeader?.replace(/^Bearer\s+/i, '')

  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('accessToken')?.value

  const accessToken = headerToken || cookieToken

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const data = await res.json()
  return NextResponse.json({ user: data })
}
