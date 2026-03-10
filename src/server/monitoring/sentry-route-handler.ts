import * as Sentry from '@sentry/nextjs'

type RouteHandler<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => TResult

type RouteHandlerOptions = {
  method: string
  route: string
  flushTimeoutMs?: number
}

export function withSentryRouteHandler<TArgs extends unknown[], TResult>(
  options: RouteHandlerOptions,
  handler: RouteHandler<TArgs, TResult>
): (...args: TArgs) => Promise<Awaited<TResult>> {
  return async function wrappedRouteHandler(
    ...args: TArgs
  ): Promise<Awaited<TResult>> {
    try {
      return await handler(...args)
    } catch (error) {
      await Sentry.withScope(async (scope) => {
        scope.setTag('route_handler', options.route)
        scope.setTag('route_method', options.method)
        scope.setContext('next_route_handler', {
          route: options.route,
          method: options.method,
        })

        Sentry.captureException(error)
        await Sentry.flush(options.flushTimeoutMs ?? 2000)
      })

      throw error
    }
  }
}
