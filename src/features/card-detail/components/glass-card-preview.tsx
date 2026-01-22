"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { type ProfileData } from "@/shared"
import { Switch } from "@/components/ui/switch"

interface GlassCardPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
  isFlip?: boolean
  onFlipChange?: (isFlip: boolean) => void
  aiDescription?: string
}

function GlassCardPreview({
  data,
  isFlip = false,
  onFlipChange,
  aiDescription,
  className,
  ...props
}: GlassCardPreviewProps) {
  const displayData = data
  const showDescription = isFlip
  const descriptionText =
    aiDescription?.trim() || "AI가 당신의 직무를 분석하고 있어요"

  return (
    <div
      data-slot="glass-card-preview"
      className={cn(
        "relative w-full rounded-[10px] bg-surface/20 backdrop-blur-md border border-white/20 p-6 shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex gap-4">
        <div className="flex flex-col justify-center flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {displayData.name}
            </h3>
            {onFlipChange && (
              <Switch
                checked={isFlip}
                onCheckedChange={onFlipChange}
                aria-label="AI 설명 토글"
              />
            )}
          </div>
          {displayData.department && (
            <p className="text-sm text-muted-foreground">
              {displayData.department}
              {displayData.position && ` / ${displayData.position}`}
            </p>
          )}
          {displayData.company && (
            <p className="text-sm text-muted-foreground">
              {displayData.company}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
        {showDescription ? (
          <p className="text-sm text-foreground whitespace-pre-line">
            {descriptionText}
          </p>
        ) : (
          <>
            {displayData.phone && (
              <p className="text-sm text-foreground">M: {displayData.phone}</p>
            )}
            {displayData.email && (
              <p className="text-sm text-foreground">E: {displayData.email}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { GlassCardPreview }
export type { GlassCardPreviewProps }
