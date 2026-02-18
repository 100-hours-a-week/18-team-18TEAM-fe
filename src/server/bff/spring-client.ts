import { getServerEnv } from '@/server/config/env'

export type ForwardRequestBody = string | ArrayBuffer

export interface SpringForwardOptions {
  apiPath: string
  search: string
  method: string
  body?: ForwardRequestBody
  requestHeaders: Headers
  accessToken?: string
}

function pickRequestHeader(headers: Headers, name: string): string | null {
  const value = headers.get(name)
  return value && value.trim() !== '' ? value : null
}

export function toProxyHeaders(headers: Headers): Headers {
  const nextHeaders = new Headers(headers)
  nextHeaders.delete('set-cookie')
  nextHeaders.delete('content-encoding')
  nextHeaders.delete('content-length')
  nextHeaders.delete('transfer-encoding')
  return nextHeaders
}

export async function forwardToSpring({
  apiPath,
  search,
  method,
  body,
  requestHeaders,
  accessToken,
}: SpringForwardOptions): Promise<Response> {
  const { springApiBaseUrl } = getServerEnv()
  const targetUrl = `${springApiBaseUrl}${apiPath}${search}`

  const headers = new Headers()
  const passthroughHeaderNames = [
    'accept',
    'accept-language',
    'content-type',
    'x-request-id',
    'user-agent',
  ]

  for (const name of passthroughHeaderNames) {
    const value = pickRequestHeader(requestHeaders, name)
    if (value) {
      headers.set(name, value)
    }
  }

  if (accessToken) {
    headers.set('authorization', `Bearer ${accessToken}`)
  }

  return fetch(targetUrl, {
    method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  })
}
