export type AuthPolicy = 'public' | 'optional' | 'normal'

const PUBLIC_PATHS = new Set(['/auth/login/kakao'])

export function resolveAuthPolicy(apiPath: string): AuthPolicy {
  if (PUBLIC_PATHS.has(apiPath)) {
    return 'public'
  }

  if (apiPath.startsWith('/cards/uuid/')) {
    return 'optional'
  }

  return 'normal'
}

export function shouldSkipRefresh(headers: Headers): boolean {
  return headers.get('x-skip-auth-handling') === '1'
}

export function isInternalOnlyPath(apiPath: string): boolean {
  return apiPath === '/auth/rotation'
}
