"use client"

import * as React from "react"
import { XCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ScanFailedStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  onRetry?: () => void
}

function ScanFailedState({
  message = "QR 코드를 인식하지 못했습니다.",
  onRetry,
  className,
  ...props
}: ScanFailedStateProps) {
  return (
    <div
      data-slot="scan-failed-state"
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      {...props}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <XCircleIcon className="size-8" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        인식 실패
      </h3>

      <p className="text-sm text-muted-foreground mb-6">{message}</p>

      {onRetry && (
        <Button type="button" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}

export { ScanFailedState }
export type { ScanFailedStateProps }
