"use client"

import * as React from "react"
import { CheckCircleIcon, SaveIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ScanResultProps extends React.HTMLAttributes<HTMLDivElement> {
  cardId: string
  name?: string
  onViewCard?: (cardId: string) => void
  onSaveCard?: (cardId: string) => void
  onScanAgain?: () => void
}

function ScanResult({
  cardId,
  name,
  onViewCard,
  onSaveCard,
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
        {name ? (
          <>
            <strong>{name}</strong>님의 명함입니다.
          </>
        ) : (
          <>식별자: {cardId}</>
        )}
      </p>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button type="button" onClick={() => onViewCard?.(cardId)}>
          명함 보기
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onSaveCard?.(cardId)}
        >
          <SaveIcon className="mr-2 size-4" />
          내 명함함에 저장
        </Button>
        <Button type="button" variant="ghost" onClick={onScanAgain}>
          다시 스캔
        </Button>
      </div>
    </div>
  )
}

export { ScanResult }
export type { ScanResultProps }
