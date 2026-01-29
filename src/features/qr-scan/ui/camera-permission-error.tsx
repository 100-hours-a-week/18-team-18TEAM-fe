'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CameraOffIcon } from 'lucide-react'
import { Header, Button } from '@/shared'

interface CameraPermissionErrorProps {
  onGoBack?: () => void
}

function CameraPermissionError({ onGoBack }: CameraPermissionErrorProps) {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.push('/scan')
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-col items-center px-7 pt-[175px]">
        {/* 카메라 꺼짐 아이콘 */}
        <CameraOffIcon
          className="text-foreground size-[109px]"
          strokeWidth={1}
        />

        {/* 제목 */}
        <h1 className="text-foreground mt-8 text-center text-[25px] font-semibold leading-[22px] tracking-[-0.5px]">
          카메라 권한이 없어
          <br />
          <span className="mt-2 inline-block">스캔할 수 없어요.</span>
        </h1>

        {/* 부제목 */}
        <p className="text-foreground mt-4 text-center text-[20px] font-normal leading-[22px] tracking-[-0.4px]">
          브라우저 설정에서
          <br />
          <span className="mt-1 inline-block">카메라 권한을 허용해 주세요.</span>
        </p>

        {/* 권한 설정 방법 */}
        <div className="mt-10 w-full max-w-[346px] rounded-[10px] bg-[#D9D9D9] px-4 py-4">
          <h2 className="text-foreground text-[20px] font-normal leading-[22px] tracking-[-0.4px]">
            권한 설정 방법
          </h2>
          <ol className="text-foreground mt-4 list-decimal space-y-1 pl-5 text-[18px] leading-[26px]">
            <li>브라우저 주소창의 자물쇠 아이콘을 클릭</li>
            <li>&apos;카메라&apos; 권한을 &apos;허용&apos;으로 변경</li>
            <li>페이지를 새로고침</li>
          </ol>
        </div>

        {/* 돌아가기 버튼 */}
        <Button
          variant="secondary"
          fullWidth
          className="mt-8 max-w-[307px] rounded-[12px] bg-[#ECECEC] text-[16px] font-bold tracking-[-0.32px]"
          onClick={handleGoBack}
        >
          돌아가기
        </Button>
      </main>
    </div>
  )
}

export { CameraPermissionError }
export type { CameraPermissionErrorProps }
