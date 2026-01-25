'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface QRScannerProps extends React.HTMLAttributes<HTMLDivElement> {
  onScan?: (data: string) => void
  isScanning?: boolean
}

function QRScanner({
  onScan,
  isScanning = true,
  className,
  ...props
}: QRScannerProps) {
  const handleMockScan = () => {
    const uuid =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10)
    onScan?.(uuid)
  }

  return (
    <div
      data-slot="qr-scanner"
      className={cn(
        'relative flex items-center justify-center bg-black',
        className
      )}
      {...props}
    >
      {/* 카메라 뷰 영역 */}
      <div className="relative aspect-square w-full max-w-[300px]">
        {/* 스캔 프레임 */}
        <div className="absolute inset-0 rounded-lg border-2 border-white/50" />

        {/* 코너 마커 */}
        <div className="border-primary absolute top-0 left-0 h-8 w-8 rounded-tl-lg border-t-4 border-l-4" />
        <div className="border-primary absolute top-0 right-0 h-8 w-8 rounded-tr-lg border-t-4 border-r-4" />
        <div className="border-primary absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4" />
        <div className="border-primary absolute right-0 bottom-0 h-8 w-8 rounded-br-lg border-r-4 border-b-4" />

        {/* 스캔 라인 애니메이션 */}
        {isScanning && (
          <div className="bg-primary absolute top-1/2 right-0 left-0 h-0.5 animate-pulse" />
        )}
      </div>

      {/* 안내 텍스트 */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-center text-sm text-white">
        <p>QR 코드를 프레임 안에 맞춰주세요</p>
        {onScan && (
          <button
            type="button"
            onClick={handleMockScan}
            className="rounded-full bg-white/20 px-3 py-1 text-xs transition-colors hover:bg-white/30"
          >
            스캔 시뮬레이션
          </button>
        )}
      </div>
    </div>
  )
}

export { QRScanner }
export type { QRScannerProps }
