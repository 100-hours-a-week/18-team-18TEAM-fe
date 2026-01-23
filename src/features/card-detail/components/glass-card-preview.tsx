'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { type ProfileData } from '@/shared'
import { Switch } from '@/components/ui/switch'

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
    aiDescription?.trim() || 'AI가 당신의 직무를 분석하고 있어요'

  return (
    <div
      data-slot="glass-card-preview"
      className={cn(
        'bg-surface/20 relative w-full rounded-[10px] border border-white/20 p-6 shadow-lg backdrop-blur-md',
        className
      )}
      {...props}
    >
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col justify-center space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-lg font-semibold">
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
            <p className="text-muted-foreground text-sm">
              {displayData.department}
              {displayData.position && ` / ${displayData.position}`}
            </p>
          )}
          {displayData.company && (
            <p className="text-muted-foreground text-sm">
              {displayData.company}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
        {showDescription ? (
          <p className="text-foreground text-sm whitespace-pre-line">
            {descriptionText}
          </p>
        ) : (
          <>
            {displayData.phone && (
              <p className="text-foreground text-sm">M: {displayData.phone}</p>
            )}
            {displayData.email && (
              <p className="text-foreground text-sm">E: {displayData.email}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { GlassCardPreview }
export type { GlassCardPreviewProps }
