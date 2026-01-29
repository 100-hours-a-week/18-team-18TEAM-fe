'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CameraIcon } from 'lucide-react'
import QrScanner from 'qr-scanner'
import { cn } from '@/lib/utils'
import { Header, Button } from '@/shared'
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
      // 스캐너 정리
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
      setIsScanning(false)

      // QR 코드에서 uuid 추출 (URL 형식: .../result?uuid=xxx)
      const url = result.data
      let uuid: string | null = null

      try {
        const urlObj = new URL(url)
        uuid = urlObj.searchParams.get('uuid')
      } catch {
        // URL이 아닌 경우 직접 uuid로 사용
        uuid = url
      }

      if (!uuid) {
        setStatus('failure')
        return
      }

      // result 페이지로 이동
      router.push(`/result?uuid=${uuid}`)
    },
    [router]
  )

  // 스캐너 초기화 (isScanning 상태 변경 후 실행)
  const initScanner = React.useCallback(async () => {
    if (!videoRef.current || scannerRef.current) return

    try {
      const scanner = new QrScanner(videoRef.current, handleScanResult, {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      })

      scannerRef.current = scanner
      await scanner.start()
    } catch (error) {
      console.error('Scanner error:', error)
      setStatus('permission-denied')
      setIsScanning(false)
    }
  }, [handleScanResult])

  // UI 상태만 변경 (실제 스캐너 초기화는 useEffect에서)
  const startScanner = async () => {
    try {
      // 카메라 권한 확인
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        setStatus('permission-denied')
        return
      }

      // 상태만 변경 - 실제 스캐너 초기화는 useEffect에서 처리
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

  // isScanning 상태가 true로 변경되면 스캐너 초기화
  React.useEffect(() => {
    if (isScanning && videoRef.current && !scannerRef.current) {
      initScanner()
    }
  }, [isScanning, initScanner])

  // 컴포넌트 언마운트 시 스캐너 정리
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

  return (
    <div className="bg-background min-h-screen">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-col items-center px-8 pt-[95px]">
        {/* 단일 비디오 엘리먼트 - 항상 DOM에 유지, 스타일만 조건부 변경 */}
        <video
          ref={videoRef}
          className={cn(
            'aspect-square w-full max-w-[328px] rounded-[10px] bg-black object-cover',
            !isScanning && 'sr-only'
          )}
        />

        {/* 스캐닝 중일 때 UI */}
        {isScanning ? (
          <div className="flex w-full flex-col items-center gap-6">
            <p className="text-muted-foreground text-center text-sm">
              QR 코드를 카메라에 비춰주세요
            </p>
            <Button
              variant="secondary"
              fullWidth
              className="max-w-[328px]"
              onClick={stopScanner}
            >
              스캔 취소
            </Button>
          </div>
        ) : (
          <>
            {/* 카메라 아이콘 및 안내 문구 */}
            <div className="flex flex-col items-center gap-1">
              <CameraIcon className="text-foreground size-12" strokeWidth={1} />
              <h1 className="text-foreground mt-2 text-center text-[28px] font-normal leading-[40px] tracking-[-0.56px]">
                QR 코드를 스캔하기 위해
                <br />
                카메라 접근 권한이 필요해요
              </h1>
            </div>

            {/* 촬영 팁 */}
            <div className="mt-10 w-full max-w-[328px] rounded-[10px] bg-[#D9D9D9] px-6 py-4">
              <h2 className="text-foreground text-[24px] font-normal leading-[40px]">
                촬영 팁
              </h2>
              <ul className="text-foreground mt-2 list-disc space-y-1 pl-5 text-[16px] leading-[40px]">
                <li>밝은 곳에서 스캔해 주세요</li>
                <li>
                  빛 반사에 주의해 주세요
                  <br />
                  <span className="text-[12px] leading-[21px] text-[#666]">
                    tip. 각도를 살짝 조절해 보세요
                  </span>
                </li>
                <li>20~30cm 정도 거리를 유지해 주세요</li>
                <li>렌즈를 깨끗이 닦아주세요</li>
              </ul>
            </div>

            {/* QR코드 인식 버튼 */}
            <Button
              variant="secondary"
              fullWidth
              className="mt-10 h-16 max-w-[328px] bg-[#D9D9D9] text-[36px] font-normal tracking-[-0.72px]"
              onClick={startScanner}
            >
              QR코드 인식
            </Button>
          </>
        )}
      </main>
    </div>
  )
}

export { QrScanPage }
