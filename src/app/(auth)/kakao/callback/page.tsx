'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginErrorState } from '@/features/auth/ui'

function KakaoCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const code = searchParams.get('code')
    const next = searchParams.get('state') || '/home'
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

    if (!code) {
      setError('인가 코드가 없습니다.')
      return
    }

    const handleLogin = async () => {
      try {
        const res = await fetch('/api/auth/login/kakao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri }),
          credentials: 'include',
        })

        if (!res.ok) {
          throw new Error('Kakao login failed')
        }
        // 로그인 성공 → /home으로 이동 → useUser 훅이 유저 정보 fetch
        router.replace(next)
      } catch (err) {
        console.error('로그인 에러:', err)
        setError('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    }

    handleLogin()
  }, [searchParams, router])

  if (error) {
    return (
      <LoginErrorState
        message={error}
        onRetry={() => router.replace('/login')}
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
      <p className="text-muted-foreground">로그인 중...</p>
    </div>
  )
}

export default function KakaoCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <React.Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-muted-foreground">로그인 중...</p>
          </div>
        }
      >
        <KakaoCallbackContent />
      </React.Suspense>
    </div>
  )
}
