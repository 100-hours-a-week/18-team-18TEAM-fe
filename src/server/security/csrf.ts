import type { NextRequest } from 'next/server'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export function isSafeMethod(method: string): boolean {
  return SAFE_METHODS.has(method.toUpperCase())
}

export function isSameOriginMutation(request: NextRequest): boolean {
  const origin = request.headers.get('origin')

  console.log('[csrf headers]', {
    method: request.method,
    path: request.nextUrl.pathname,
    host: request.headers.get('host'),
    xForwardedHost: request.headers.get('x-forwarded-host'),
    xForwardedProto: request.headers.get('x-forwarded-proto'),
    origin,
    nextUrlHost: request.nextUrl.host,
    nextUrlProtocol: request.nextUrl.protocol,
  })

  if (!origin) return true

  try {
    const originUrl = new URL(origin)
    const currentUrl = request.nextUrl
    return originUrl.host === currentUrl.host
  } catch {
    return false
  }
}
