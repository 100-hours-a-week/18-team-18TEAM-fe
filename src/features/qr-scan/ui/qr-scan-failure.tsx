'use client'

import * as React from 'react'
import { Button } from '@/shared'

interface QrScanFailureProps {
  onRetry?: () => void
}

function QrScanFailure({ onRetry }: QrScanFailureProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-8">
      {/* 제목 */}
      <h1 className="text-foreground text-[36px] leading-none font-semibold">
        Oops....
      </h1>

      {/* 안내 문구 */}
      <p className="text-foreground mt-[71px] text-center text-[20px] leading-none font-normal">
        QR 스캔에 실패하셨습니다.
        <br />
        <span className="mt-2 inline-block">다시 시도해주세요.</span>
      </p>

      {/* 다시 QR 인식하기 버튼 */}
      <Button
        variant="secondary"
        fullWidth
        className="mt-[105px] max-w-[334px] rounded-[10px] bg-[#ECECEC] text-[12px] font-medium tracking-[-0.24px]"
        onClick={onRetry}
      >
        다시 QR 인식하기
      </Button>
    </div>
  )
}

export { QrScanFailure }
export type { QrScanFailureProps }
