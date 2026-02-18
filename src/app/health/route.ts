export const runtime = 'nodejs'

export function GET() {
  return new Response('ok', {
    status: 200,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}

export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'cache-control': 'no-store',
    },
  })
}
