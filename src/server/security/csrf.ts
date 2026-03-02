import type { NextRequest } from 'next/server'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const ALLOWED_HOSTS = ['localhost:3000', 'dev.cardcaro.com', 'cardcaro.com']

export function isSafeMethod(method: string): boolean {
  return SAFE_METHODS.has(method.toUpperCase())
}

export function isSameOriginMutation(request: NextRequest): boolean {
  const origin = request.headers.get('origin')

  if (!origin) return true

  try {
    const originUrl = new URL(origin)
    const rawForwardedHost = request.headers.get('x-forwarded-host')
    const rawHost = request.headers.get('host')
    const effectiveHost =
      rawForwardedHost?.split(',')[0].trim().toLowerCase() ??
      rawHost?.trim().toLowerCase()

    if (!effectiveHost) {
      return false
    }
    if (!ALLOWED_HOSTS.includes(effectiveHost)) {
      return false
    }

    return originUrl.host.toLowerCase() === effectiveHost
  } catch {
    return false
  }
}
