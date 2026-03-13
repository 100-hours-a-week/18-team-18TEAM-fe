'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean
      init: (appKey: string) => void
      Share: {
        sendDefault: (options: {
          objectType: string
          content: {
            title: string
            description: string
            imageUrl: string
            link: { mobileWebUrl: string; webUrl: string }
          }
          buttons: Array<{
            title: string
            link: { mobileWebUrl: string; webUrl: string }
          }>
        }) => void
      }
    }
  }
}

function KakaoScript() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY

    if (window.Kakao) {
      if (appKey && !window.Kakao.isInitialized()) {
        window.Kakao.init(appKey)
      }
      return
    }

    let idleId: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let scheduled = false

    const scheduleLoad = () => {
      if (scheduled) return
      scheduled = true
      setShouldLoad(true)

      if (idleId !== null && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(scheduleLoad, { timeout: 2000 })
    }

    timeoutId = setTimeout(scheduleLoad, 150)

    return () => {
      if (idleId !== null && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const onLoad = () => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
    if (appKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(appKey)
    }
  }

  if (!shouldLoad) return null

  return (
    <Script
      id="kakao-sdk"
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
      strategy="lazyOnload"
      onLoad={onLoad}
    />
  )
}

export { KakaoScript }
