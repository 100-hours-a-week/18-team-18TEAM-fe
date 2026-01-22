"use client"

import * as React from "react"
import { ShareIcon, QrCodeIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconButton } from "@/shared"

interface ShareActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onShare?: () => void
  onShowQR?: () => void
  onCopyLink?: () => void
}

function ShareActions({
  onShare,
  onShowQR,
  onCopyLink,
  className,
  ...props
}: ShareActionsProps) {
  return (
    <div
      data-slot="share-actions"
      className={cn(
        "flex items-center justify-center gap-6 p-4 bg-background/60 backdrop-blur-md rounded-lg",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-1">
        <IconButton
          variant="surface"
          size="lg"
          onClick={onShare}
          aria-label="공유하기"
        >
          <ShareIcon className="size-5" />
        </IconButton>
        <span className="text-xs text-muted-foreground">공유</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <IconButton
          variant="surface"
          size="lg"
          onClick={onShowQR}
          aria-label="QR 코드"
        >
          <QrCodeIcon className="size-5" />
        </IconButton>
        <span className="text-xs text-muted-foreground">QR</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <IconButton
          variant="surface"
          size="lg"
          onClick={onCopyLink}
          aria-label="링크 복사"
        >
          <CopyIcon className="size-5" />
        </IconButton>
        <span className="text-xs text-muted-foreground">링크</span>
      </div>
    </div>
  )
}

export { ShareActions }
export type { ShareActionsProps }
