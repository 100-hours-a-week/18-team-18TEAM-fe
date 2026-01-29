'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CameraIcon, ScanIcon, LightbulbIcon } from 'lucide-react'
import QrScanner from 'qr-scanner'
import { Header, Button, Card, CardContent } from '@/shared'
import { CameraPermissionError } from './camera-permission-error'
import { QrScanFailure } from './qr-scan-failure'
import type { QrScanStatus } from '../model'

function QrScanPage() {
  const router = useRouter()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const scannerRef = React.useRef<QrScanner | null>(null)

  const [status, setStatus] = React.useState<QrScanStatus>('idle')
  const [isScanning, setIsScanning] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  const stopScanner = React.useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current.destroy()
      scannerRef.current = null
    }
    setIsScanning(false)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    stopScanner()
    router.replace('/home')
  }

  const handleScanResult = React.useCallback(
    (result: QrScanner.ScanResult) => {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
      setIsScanning(false)

      const url = result.data
      let uuid: string | null = null

      try {
        const urlObj = new URL(url)
        uuid = urlObj.searchParams.get('uuid')
      } catch {
        uuid = url
      }

      if (!uuid) {
        setStatus('failure')
        return
      }

      router.push(`/result?uuid=${uuid}`)
    },
    [router]
  )

  const initScanner = React.useCallback(async () => {
    if (!videoRef.current || scannerRef.current) return

    try {
      const scanner = new QrScanner(videoRef.current, handleScanResult, {
        returnDetailedScanResult: true,
        highlightScanRegion: false,
        highlightCodeOutline: false,
      })

      scannerRef.current = scanner
      await scanner.start()
    } catch (error) {
      console.error('Scanner error:', error)
      setStatus('permission-denied')
      setIsScanning(false)
    }
  }, [handleScanResult])

  const startScanner = async () => {
    try {
      setStatus('requesting')

      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        setStatus('permission-denied')
        return
      }

      setIsScanning(true)
      setStatus('scanning')
    } catch (error) {
      console.error('Scanner error:', error)
      setStatus('permission-denied')
    }
  }

  const handleRetry = () => {
    setStatus('idle')
  }

  const handleGoBack = () => {
    setStatus('idle')
  }

  React.useEffect(() => {
    if (isScanning && videoRef.current && !scannerRef.current) {
      initScanner()
    }
  }, [isScanning, initScanner])

  React.useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [stopScanner])

  // 권한 거부 화면
  if (status === 'permission-denied') {
    return <CameraPermissionError onGoBack={handleGoBack} />
  }

  // 스캔 실패 화면
  if (status === 'failure') {
    return <QrScanFailure onRetry={handleRetry} />
  }

  if (isClosing) {
    return null
  }

  // 권한 요청 중 화면
  if (status === 'requesting') {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Header showClose onClose={handleClose} />

        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
              <CameraIcon className="size-8 text-accent" strokeWidth={1.5} />
            </div>
            <p className="text-muted-foreground text-center text-base">
              카메라 권한을 확인하고 있습니다...
            </p>
          </div>
        </main>
      </div>
    )
  }

  // 스캐닝 화면
  if (isScanning) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Header showClose onClose={handleClose} />

        <main className="flex flex-1 flex-col items-center px-6 pt-8">
          {/* 카메라 뷰 */}
          <div className="relative w-full max-w-[328px]">
            <video
              ref={videoRef}
              className="aspect-square w-full rounded-xl bg-black object-cover"
            />
            {/* 스캔 프레임 오버레이 */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative size-48 rounded-lg">
                {/* 코너 강조 */}
                <div className="absolute -left-0.5 -top-0.5 size-4 border-l-4 border-t-4 border-primary rounded-tl" />
                <div className="absolute -right-0.5 -top-0.5 size-4 border-r-4 border-t-4 border-primary rounded-tr" />
                <div className="absolute -bottom-0.5 -left-0.5 size-4 border-b-4 border-l-4 border-primary rounded-bl" />
                <div className="absolute -bottom-0.5 -right-0.5 size-4 border-b-4 border-r-4 border-primary rounded-br" />
                {/* 스캔 라인 애니메이션 */}
                <div className="animate-scan-line absolute left-2 right-2 h-0.5 bg-destructive" />
              </div>
            </div>
          </div>

          {/* 안내 텍스트 */}
          <p className="text-muted-foreground mt-6 text-center text-sm">
            QR 코드를 프레임 안에 맞춰주세요
          </p>

          {/* 스캔 취소 버튼 */}
          <Button
            variant="outline"
            fullWidth
            className="mt-8 max-w-[328px]"
            onClick={stopScanner}
          >
            스캔 취소
          </Button>
        </main>
      </div>
    )
  }

  // 초기 화면 (idle)
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-1 flex-col items-center px-6 pt-12">
        {/* 아이콘 및 제목 */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
            <ScanIcon className="size-8 text-accent" strokeWidth={1.5} />
          </div>
          <h1 className="text-foreground text-center text-2xl font-semibold">
            QR 코드 스캔
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            명함의 QR 코드를 스캔하여
            <br />
            연락처를 저장하세요
          </p>
        </div>

        {/* 촬영 팁 카드 */}
        <Card variant="outline" className="mt-8 w-full max-w-[328px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <LightbulbIcon className="size-5 text-accent" strokeWidth={1.5} />
              <h2 className="text-foreground text-base font-medium">
                촬영 팁
              </h2>
            </div>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>밝은 곳에서 스캔해 주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>
                  빛 반사에 주의해 주세요
                  <span className="text-muted-foreground/70 ml-1 text-xs">
                    (각도를 살짝 조절해 보세요)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>20~30cm 정도 거리를 유지해 주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>렌즈를 깨끗이 닦아주세요</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA 버튼 */}
        <Button
          variant="primary"
          fullWidth
          className="mt-8 max-w-[328px]"
          onClick={startScanner}
        >
          <CameraIcon className="mr-2 size-5" strokeWidth={1.5} />
          QR코드 스캔 시작
        </Button>
      </main>

      {/* 숨겨진 비디오 엘리먼트 (DOM에 유지) */}
      <video ref={videoRef} className="sr-only" />
    </div>
  )
}

export { QrScanPage }
