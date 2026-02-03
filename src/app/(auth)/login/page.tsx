'use client'

import * as React from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getKakaoAuthUrl } from '@/features/auth/api'
import { TermsDialog, PrivacyDialog } from '@/features/auth/ui'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [termsOpen, setTermsOpen] = React.useState(false)
  const [privacyOpen, setPrivacyOpen] = React.useState(false)

  const handleKakaoLogin = () => {
    const next = searchParams.get('next') || undefined
    window.location.href = getKakaoAuthUrl(next)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <Image
          src="/icons/Bizkit_logo.png"
          alt="BizKit"
          width={184}
          height={47}
          priority
        />

        <button
          type="button"
          onClick={handleKakaoLogin}
          className="overflow-hidden rounded-lg"
        >
          <Image
            src="/icons/kakao_login_large_wide.png"
            alt="카카오 로그인"
            width={300}
            height={45}
            className="w-full"
            priority
          />
        </button>

        <p className="text-muted-foreground text-center text-xs">
          카카오 로그인 시{' '}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="text-foreground underline underline-offset-2"
          >
            이용약관
          </button>{' '}
          및{' '}
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="text-foreground underline underline-offset-2"
          >
            개인정보처리방침
          </button>
          에 동의한 것으로 간주합니다.
        </p>
      </div>

      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </div>
  )
}
