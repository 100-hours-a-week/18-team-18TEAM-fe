'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CameraIcon,
  RefreshCwIcon,
  ScanIcon,
  LightbulbIcon,
} from 'lucide-react'
import { useAtom } from 'jotai'
import { Header, Button, Card, CardContent } from '@/shared'
import { CameraPermissionError, QrScanFailure } from '@/features/qr-scan'
import { cameraPermissionAtom } from '@/features/qr-scan/model'
import { startOcrJob } from '../api'
import { ocrFlowAtom } from '../model'

type OcrPermissionStatus =
  | 'idle'
  | 'requesting'
  | 'camera-ready'
  | 'preview'
  | 'permission-denied'
  | 'submitting'
  | 'failure'

function OcrPermissionPage() {
  const router = useRouter()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const isActiveRef = React.useRef(true)
  const requestIdRef = React.useRef(0)

  const [cameraPermission, setCameraPermission] = useAtom(cameraPermissionAtom)
  const [ocrFlow, setOcrFlow] = useAtom(ocrFlowAtom)
  const [status, setStatus] = React.useState<OcrPermissionStatus>('idle')

  const mode = ocrFlow.mode

  const invalidatePendingRequest = React.useCallback(() => {
    requestIdRef.current += 1
  }, [])

  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const cleanupCamera = React.useCallback(() => {
    invalidatePendingRequest()
    stopCamera()
  }, [invalidatePendingRequest, stopCamera])

  const startCamera = React.useCallback(async () => {
    const currentRequestId = requestIdRef.current + 1
    requestIdRef.current = currentRequestId

    try {
      stopCamera()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
        },
        audio: false,
      })

      if (!isActiveRef.current || requestIdRef.current !== currentRequestId) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        void videoRef.current.play().catch((playError) => {
          console.error('Failed to play OCR camera stream:', playError)
        })
      }

      setCameraPermission('granted')
      setStatus('camera-ready')
    } catch (error) {
      if (!isActiveRef.current || requestIdRef.current !== currentRequestId) {
        return
      }

      console.error('Failed to start OCR camera:', error)

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setCameraPermission('denied')
        setStatus('permission-denied')
        return
      }

      setStatus('failure')
    }
  }, [setCameraPermission, stopCamera])

  React.useEffect(() => {
    isActiveRef.current = true

    if (!mode) {
      router.replace('/home')
      return
    }

    return () => {
      isActiveRef.current = false
      cleanupCamera()
    }
  }, [cleanupCamera, mode, router])

  React.useEffect(() => {
    if (status !== 'camera-ready') return
    if (!videoRef.current || !streamRef.current) return

    if (videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }

    void videoRef.current.play().catch((error) => {
      console.error('Failed to play OCR camera stream:', error)
    })
  }, [status])

  const handleClose = () => {
    cleanupCamera()
    setOcrFlow({ mode: null, capturedImageUrl: null })
    router.replace('/home')
  }

  const handleStart = async () => {
    try {
      setStatus('requesting')

      if (cameraPermission === 'denied') {
        setStatus('permission-denied')
        return
      }

      await startCamera()
    } catch (error) {
      console.error('OCR permission check error:', error)
      setCameraPermission('denied')
      setStatus('permission-denied')
    }
  }

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    const baseWidth = video.videoWidth || 1280
    const baseHeight = video.videoHeight || 720
    const maxWidth = 1280
    const scale = Math.min(1, maxWidth / baseWidth)

    canvas.width = Math.floor(baseWidth * scale)
    canvas.height = Math.floor(baseHeight * scale)

    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const image = canvas.toDataURL('image/jpeg', 0.82)
    setOcrFlow((prev) => ({ ...prev, capturedImageUrl: image }))
    cleanupCamera()
    setStatus('preview')
  }

  const handleRetake = async () => {
    setOcrFlow((prev) => ({ ...prev, capturedImageUrl: null }))
    setStatus('requesting')
    await startCamera()
  }

  const handleProceed = async () => {
    if (!mode || !ocrFlow.capturedImageUrl) {
      setStatus('failure')
      return
    }

    try {
      setStatus('submitting')
      const { task_id } = await startOcrJob({
        mode,
        capturedImageUrl: ocrFlow.capturedImageUrl,
      })

      cleanupCamera()
      router.push(`/ocr/result?task_id=${encodeURIComponent(task_id)}`)
    } catch (error) {
      console.error('Failed to start OCR job:', error)
      setStatus('failure')
    }
  }

  const handlePermissionGoBack = () => {
    cleanupCamera()
    setStatus('idle')
  }

  const handleFailureRetry = () => {
    cleanupCamera()
    setStatus('idle')
  }

  if (status === 'permission-denied') {
    return (
      <CameraPermissionError
        title="카메라 권한이 없어요"
        description="OCR 촬영을 하려면\n카메라 권한을 허용해 주세요"
        goBackPath="/ocr"
        onGoBack={handlePermissionGoBack}
        onClose={handleClose}
      />
    )
  }

  if (status === 'failure') {
    return (
      <QrScanFailure
        title="Oops...."
        descriptionLines={[
          '명함 OCR 인식에 실패했습니다.',
          '다시 시도해주세요.',
        ]}
        retryLabel="다시 시도하기"
        onRetry={handleFailureRetry}
      />
    )
  }

  if (status === 'requesting') {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Header showClose onClose={handleClose} />

        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-accent/10 flex size-16 items-center justify-center rounded-full">
              <CameraIcon className="text-accent size-8" strokeWidth={1.5} />
            </div>
            <p className="text-muted-foreground text-center text-base">
              카메라 권한을 확인하고 있습니다...
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (
    status === 'camera-ready' ||
    status === 'preview' ||
    status === 'submitting'
  ) {
    const capturedImageUrl = ocrFlow.capturedImageUrl

    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Header showClose onClose={handleClose} />

        <main className="flex flex-1 flex-col items-center px-6 pt-16">
          <div className="relative w-full max-w-[328px]">
            {(status === 'preview' || status === 'submitting') &&
            capturedImageUrl ? (
              <img
                src={capturedImageUrl}
                alt="촬영한 명함"
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                className="aspect-square w-full rounded-xl bg-black object-cover"
                muted
                playsInline
                autoPlay
              />
            )}
          </div>

          {status === 'preview' || status === 'submitting' ? (
            <>
              <p className="text-muted-foreground mt-6 text-center text-sm">
                촬영된 이미지를 확인한 뒤
                <br />
                인식 진행 또는 다시 촬영을 선택해 주세요
              </p>

              <div className="mt-8 flex w-full max-w-[328px] flex-col gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<RefreshCwIcon className="size-4" />}
                  onClick={handleRetake}
                  disabled={status === 'submitting'}
                >
                  다시 촬영
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  loading={status === 'submitting'}
                  onClick={handleProceed}
                >
                  인식 진행
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mt-6 text-center text-sm">
                명함을 프레임에 맞추고
                <br />
                촬영 버튼을 눌러주세요
              </p>

              <Button
                variant="primary"
                fullWidth
                className="mt-8 max-w-[328px]"
                leftIcon={<CameraIcon className="size-5" strokeWidth={1.5} />}
                onClick={handleCapture}
                disabled={status !== 'camera-ready'}
              >
                촬영하기
              </Button>
            </>
          )}
        </main>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-1 flex-col items-center px-6 pt-24">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-accent/10 flex size-16 items-center justify-center rounded-full">
            <ScanIcon className="text-accent size-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-foreground text-center text-2xl font-semibold">
            명함 OCR 촬영
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            종이 명함을 촬영하여
            <br />
            연락처를 저장하세요
          </p>
        </div>

        <Card variant="outline" className="mt-8 w-full max-w-[328px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <LightbulbIcon className="text-accent size-5" strokeWidth={1.5} />
              <h2 className="text-foreground text-base font-medium">촬영 팁</h2>
            </div>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>밝은 곳에서 촬영해 주세요</span>
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
                <span>명함 테두리가 화면 안에 들어오게 맞춰주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>초점이 맞을 때까지 잠시 기다려주세요</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Button
          variant="primary"
          fullWidth
          className="mt-8 max-w-[328px]"
          onClick={handleStart}
        >
          <CameraIcon className="mr-2 size-5" strokeWidth={1.5} />
          촬영 시작
        </Button>
      </main>

      <video ref={videoRef} className="sr-only" />
    </div>
  )
}

export { OcrPermissionPage }
