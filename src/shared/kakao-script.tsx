'use client'

import Script from 'next/script'

declare global {
  interface Window {
    Kakao: {
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
  const onLoad = () => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
    if (appKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(appKey)
    }
  }

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
      async
      onLoad={onLoad}
    />
  )
}

export { KakaoScript }
