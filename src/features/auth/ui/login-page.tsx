'use client'

import * as React from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getKakaoAuthUrl } from '@/features/auth/api'
import { TermsDialog } from './terms-dialog'
import { PrivacyDialog } from './privacy-dialog'

export function LoginPage() {
  const searchParams = useSearchParams()
  const [termsOpen, setTermsOpen] = React.useState(false)
  const [privacyOpen, setPrivacyOpen] = React.useState(false)

  const handleKakaoLogin = () => {
    const next = searchParams.get('next') || undefined
    window.location.href = getKakaoAuthUrl(next)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#022840]">
      {/* 상단 다크 영역: 로고 + 캐릭터 */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-end">
        <Image
          src="/icons/BizKit_logo_white.png"
          alt="BizKit"
          width={223}
          height={149}
          priority
        />
        <Image
          src="/icons/BizKit_login_cha.png"
          alt=""
          width={400}
          height={400}
          className="-mt-20 -mb-14"
          unoptimized
        />
      </div>

      {/* 하단 흰색 카드 영역 */}
      <div className="animate-slide-up relative z-20 rounded-t-[20px] bg-white px-4 pt-10 pb-20">
        <div className="mx-auto flex w-full max-w-[370px] flex-col items-center gap-5">
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full overflow-hidden rounded-xl"
          >
            <Image
              src="/icons/kakao_login_large_wide.png"
              alt="카카오 로그인"
              width={600}
              height={90}
              className="w-full"
              priority
            />
          </button>

          <p className="text-center text-xs tracking-[-0.24px] text-[#2b2b2a]">
            카카오 로그인 시{' '}
            <button
              type="button"
              onClick={() => setTermsOpen(true)}
              className="underline underline-offset-2"
            >
              이용약관
            </button>{' '}
            및{' '}
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="underline underline-offset-2"
            >
              개인정보처리방침
            </button>
            에 동의한 것으로 간주합니다.
          </p>
        </div>
      </div>

      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </div>
  )
}
