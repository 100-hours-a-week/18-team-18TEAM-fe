import * as Sentry from '@sentry/nextjs'
import { withSentryRouteHandler } from '@/server/monitoring/sentry-route-handler'

export const dynamic = 'force-dynamic'

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'SentryExampleAPIError'
  }
}

// A faulty API route to test Sentry's error monitoring
const handleGet = () => {
  Sentry.logger.info('Sentry example API called')
  throw new SentryExampleAPIError(
    'This error is raised on the backend called by the example page.'
  )
}

export const GET = withSentryRouteHandler(
  {
    method: 'GET',
    route: '/api/sentry-example-api',
  },
  handleGet
)
