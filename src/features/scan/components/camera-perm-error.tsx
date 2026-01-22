"use client"

import * as React from "react"
import { CameraOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CameraPermErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  onRequestPermission?: () => void
  onGoToSettings?: () => void
}

function CameraPermError({
  onRequestPermission,
  onGoToSettings,
  className,
  ...props
}: CameraPermErrorProps) {
  return (
    <div
      data-slot="camera-perm-error"
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center px-6",
        className
      )}
      {...props}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <CameraOffIcon className="size-8" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        카메라 권한이 필요합니다
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        QR 코드를 스캔하려면 카메라 접근 권한이 필요합니다. 설정에서 카메라
        권한을 허용해주세요.
      </p>

      <div className="flex gap-3">
        {onRequestPermission && (
          <Button type="button" variant="outline" onClick={onRequestPermission}>
            권한 요청
          </Button>
        )}
        {onGoToSettings && (
          <Button type="button" onClick={onGoToSettings}>
            설정으로 이동
          </Button>
        )}
      </div>
    </div>
  )
}

export { CameraPermError }
export type { CameraPermErrorProps }
