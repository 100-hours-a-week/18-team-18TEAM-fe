'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CameraOffIcon, SettingsIcon } from 'lucide-react'
import { Header, Button, Card, CardContent } from '@/shared'

interface CameraPermissionErrorProps {
  onGoBack?: () => void
  onClose?: () => void
  title?: string
  description?: string
  goBackPath?: string
  backButtonLabel?: string
  permissionGuideTitle?: string
  permissionGuideSteps?: string[]
}

function CameraPermissionError({
  onGoBack,
  onClose,
  title = '카메라 권한이 없어요',
  description = 'QR 코드를 스캔하려면\n카메라 권한을 허용해 주세요',
  goBackPath = '/scan',
  backButtonLabel = '돌아가기',
  permissionGuideTitle = '권한 설정 방법',
  permissionGuideSteps = [
    '브라우저 주소창의 자물쇠 아이콘을 클릭',
    "'카메라' 권한을 '허용'으로 변경",
    '페이지를 새로고침',
  ],
}: CameraPermissionErrorProps) {
  const router = useRouter()

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }
    router.back()
  }

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.push(goBackPath)
    }
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-1 flex-col items-center px-6 pt-12">
        {/* 아이콘 및 제목 */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
            <CameraOffIcon
              className="text-destructive size-8"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-foreground text-center text-2xl font-semibold">
            {title}
          </h1>
          <p className="text-muted-foreground text-center text-sm whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* 권한 설정 방법 카드 */}
        <Card variant="outline" className="mt-8 w-full max-w-[328px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <SettingsIcon className="text-accent size-5" strokeWidth={1.5} />
              <h2 className="text-foreground text-base font-medium">
                {permissionGuideTitle}
              </h2>
            </div>
            <ol className="text-muted-foreground mt-3 list-decimal space-y-2 pl-5 text-sm">
              {permissionGuideSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* 버튼 영역 */}
        <div className="mt-8 flex w-full max-w-[328px] flex-col gap-3">
          <Button variant="outline" fullWidth onClick={handleGoBack}>
            {backButtonLabel}
          </Button>
        </div>
      </main>
    </div>
  )
}

export { CameraPermissionError }
export type { CameraPermissionErrorProps }
