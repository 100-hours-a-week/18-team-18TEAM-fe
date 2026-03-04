'use client'

import * as React from 'react'
import { Button, type ButtonVariant } from '@/shared'

interface QrScanFailureProps {
  onRetry?: () => void
  title?: string
  descriptionLines?: [string, string] | string[]
  retryLabel?: string
  retryButtonVariant?: ButtonVariant
}

function QrScanFailure({
  onRetry,
  title = 'Oops....',
  descriptionLines = ['QR 스캔에 실패하셨습니다.', '다시 시도해주세요.'],
  retryLabel = '다시 QR 인식하기',
  retryButtonVariant = 'outline',
}: QrScanFailureProps) {
  const [firstLine = '', secondLine = ''] = descriptionLines

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-8">
      {/* 제목 */}
      <h1 className="text-foreground text-[36px] leading-none font-semibold">
        {title}
      </h1>

      {/* 안내 문구 */}
      <p className="text-foreground mt-[71px] text-center text-[20px] leading-none font-normal">
        {firstLine}
        <br />
        <span className="mt-2 inline-block">{secondLine}</span>
      </p>

      {/* 다시 QR 인식하기 버튼 */}
      <Button
        variant={retryButtonVariant}
        fullWidth
        className="mt-[105px] max-w-[334px] rounded-[10px] text-[12px] font-medium tracking-[-0.24px]"
        onClick={onRetry}
      >
        {retryLabel}
      </Button>
    </div>
  )
}

export { QrScanFailure }
export type { QrScanFailureProps }
