import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const headerToken = authHeader?.replace(/^Bearer\s+/i, '')

  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('accessToken')?.value

  const accessToken = headerToken || cookieToken

  if (accessToken) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  cookieStore.delete('accessToken')

  return NextResponse.json({ success: true })
}
