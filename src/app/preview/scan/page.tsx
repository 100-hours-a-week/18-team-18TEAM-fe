"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  QRScanner,
  ScanResult,
  ScanFailedState,
  CameraPermError,
} from "@/features/scan/components"

export default function ScanPreviewPage() {
  const [scannedData, setScannedData] = React.useState<string | null>(null)
  const [showError, setShowError] = React.useState(false)
  const [showPermError, setShowPermError] = React.useState(false)

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Scan Component Preview</h1>
        <p className="text-sm text-muted-foreground">QR 스캔 관련 컴포넌트를 테스트합니다.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">QRScanner</h2>
        <QRScanner
          onScan={(data) => {
            setScannedData(data)
            toast.success(`스캔 성공: ${data}`)
          }}
          onError={(error) => {
            setShowError(true)
            toast.error(`스캔 실패: ${error}`)
          }}
        />
      </section>

      {scannedData && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">ScanResult</h2>
          <ScanResult
            data={scannedData}
            onView={() => toast.info("결과 보기")}
            onShare={() => toast.info("공유")}
          />
        </section>
      )}

      {showError && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">ScanFailedState</h2>
          <ScanFailedState
            onRetry={() => {
              setShowError(false)
              toast.info("재시도")
            }}
          />
        </section>
      )}

      {showPermError && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">CameraPermError</h2>
          <CameraPermError
            onRetry={() => {
              setShowPermError(false)
              toast.info("권한 재시도")
            }}
          />
        </section>
      )}

      <div className="flex gap-3">
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => setShowPermError(true)}
        >
          카메라 권한 오류 보기
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => setShowError(true)}
        >
          스캔 실패 상태 보기
        </button>
      </div>
    </div>
  )
}
