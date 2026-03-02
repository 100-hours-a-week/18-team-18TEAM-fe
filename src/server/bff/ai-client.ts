import { getServerEnv } from '@/server/config/env'
import type { ForwardRequestBody } from '@/server/bff/spring-client'

export interface AiForwardOptions {
  apiPath: string
  search: string
  method: string
  body?: ForwardRequestBody
  requestHeaders: Headers
}

function pickRequestHeader(headers: Headers, name: string): string | null {
  const value = headers.get(name)
  return value && value.trim() !== '' ? value : null
}

function getAiBaseUrl(): string {
  const { aiApiBaseUrl } = getServerEnv()
  if (!aiApiBaseUrl) {
    throw new Error('AI_API_BASE_URL is required for /bff/ai routes.')
  }
  return aiApiBaseUrl
}

export async function forwardToAi({
  apiPath,
  search,
  method,
  body,
  requestHeaders,
}: AiForwardOptions): Promise<Response> {
  const targetUrl = `${getAiBaseUrl()}${apiPath}${search}`

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

  return fetch(targetUrl, {
    method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  })
}
