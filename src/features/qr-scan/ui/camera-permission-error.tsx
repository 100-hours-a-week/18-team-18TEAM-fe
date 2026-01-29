'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CameraOffIcon, SettingsIcon } from 'lucide-react'
import { Header, Button, Card, CardContent } from '@/shared'

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
    <div className="bg-background flex min-h-screen flex-col">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-1 flex-col items-center px-6 pt-12">
        {/* 아이콘 및 제목 */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <CameraOffIcon
              className="size-8 text-destructive"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-foreground text-center text-2xl font-semibold">
            카메라 권한이 없어요
          </h1>
          <p className="text-muted-foreground text-center text-sm">
            QR 코드를 스캔하려면
            <br />
            카메라 권한을 허용해 주세요
          </p>
        </div>

        {/* 권한 설정 방법 카드 */}
        <Card variant="outline" className="mt-8 w-full max-w-[328px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <SettingsIcon className="size-5 text-accent" strokeWidth={1.5} />
              <h2 className="text-foreground text-base font-medium">
                권한 설정 방법
              </h2>
            </div>
            <ol className="text-muted-foreground mt-3 list-decimal space-y-2 pl-5 text-sm">
              <li>브라우저 주소창의 자물쇠 아이콘을 클릭</li>
              <li>&apos;카메라&apos; 권한을 &apos;허용&apos;으로 변경</li>
              <li>페이지를 새로고침</li>
            </ol>
          </CardContent>
        </Card>

        {/* 버튼 영역 */}
        <div className="mt-8 flex w-full max-w-[328px] flex-col gap-3">
          <Button variant="outline" fullWidth onClick={handleGoBack}>
            돌아가기
          </Button>
        </div>
      </main>
    </div>
  )
}

export { CameraPermissionError }
export type { CameraPermissionErrorProps }
