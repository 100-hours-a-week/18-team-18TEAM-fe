"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
  return (
    <div
      data-slot="qr-scanner"
      className={cn(
        "relative flex items-center justify-center bg-black",
        className
      )}
      {...props}
    >
      {/* 카메라 뷰 영역 */}
      <div className="relative w-full aspect-square max-w-[300px]">
        {/* 스캔 프레임 */}
        <div className="absolute inset-0 border-2 border-white/50 rounded-lg" />

        {/* 코너 마커 */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

        {/* 스캔 라인 애니메이션 */}
        {isScanning && (
          <div className="absolute left-0 right-0 h-0.5 bg-primary animate-pulse top-1/2" />
        )}
      </div>

      {/* 안내 텍스트 */}
      <p className="absolute bottom-8 text-white text-sm text-center">
        QR 코드를 프레임 안에 맞춰주세요
      </p>
    </div>
  )
}

export { QRScanner }
export type { QRScannerProps }
