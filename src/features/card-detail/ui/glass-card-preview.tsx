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
        'relative h-[140px] w-full rounded-[10px] bg-[#BFAE9F]/90 px-5 py-4 shadow-lg',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-inter text-[22px] font-semibold text-black">
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

      <div className="mt-2">
        {showDescription ? (
          <div className="max-h-[76px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-transparent">
            <p className="font-inter text-[18px] leading-snug font-normal whitespace-pre-line text-black">
              {descriptionText}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <p className="font-inter text-[18px] font-normal text-black">
              {displayData.company || (
                <span style={{ color: '#757575' }}>회사명</span>
              )}
            </p>
            <p className="font-inter text-[18px] font-normal text-black">
              {displayData.department || (
                <span style={{ color: '#757575' }}>부서</span>
              )}
              {' / '}
              {displayData.position || (
                <span style={{ color: '#757575' }}>직책</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export { GlassCardPreview }
export type { GlassCardPreviewProps }
