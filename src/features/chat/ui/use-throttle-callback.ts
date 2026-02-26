'use client'

import * as React from 'react'

/**
 * Leading + Trailing throttle hook.
 * - 첫 호출: 즉시 실행
 * - 쿨다운 중 추가 호출: 윈도우 끝에서 마지막 args로 실행
 * - 언마운트 시 타이머 정리
 */
export function useThrottleCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number
) {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingArgsRef = React.useRef<Args | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return React.useCallback(
    (...args: Args) => {
      if (timerRef.current) {
        pendingArgsRef.current = args
        return
      }

      callbackRef.current(...args)

      timerRef.current = setTimeout(() => {
        timerRef.current = null

        if (pendingArgsRef.current) {
          const trailingArgs = pendingArgsRef.current
          pendingArgsRef.current = null
          callbackRef.current(...trailingArgs)

          timerRef.current = setTimeout(() => {
            timerRef.current = null
            if (pendingArgsRef.current) {
              const finalArgs = pendingArgsRef.current
              pendingArgsRef.current = null
              callbackRef.current(...finalArgs)
            }
          }, delayMs)
        }
      }, delayMs)
    },
    [delayMs]
  )
}
