"use client"

import * as React from "react"
import { CheckCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ScanResultProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  onViewCard?: () => void
  onScanAgain?: () => void
}

function ScanResult({
  name,
  onViewCard,
  onScanAgain,
  className,
  ...props
}: ScanResultProps) {
  return (
    <div
      data-slot="scan-result"
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      {...props}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
        <CheckCircleIcon className="size-8" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        명함을 찾았습니다!
      </h3>

      <p className="text-sm text-muted-foreground mb-6">
        <strong>{name}</strong>님의 명함입니다.
      </p>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onScanAgain}>
          다시 스캔
        </Button>
        <Button type="button" onClick={onViewCard}>
          명함 보기
        </Button>
      </div>
    </div>
  )
}

export { ScanResult }
export type { ScanResultProps }
