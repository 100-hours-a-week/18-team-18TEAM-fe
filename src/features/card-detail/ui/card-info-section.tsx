'use client'

import * as React from 'react'
import { PhoneIcon, Copy, PhoneCallIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/shared'

interface CardInfo {
  phone?: string
  email?: string
  tel?: string
}

interface CardInfoSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  info: CardInfo
  onPhoneClick?: () => void
  onEmailClick?: () => void
  onTelClick?: () => void
}

function CardInfoSection({
  info,
  onPhoneClick,
  onEmailClick,
  onTelClick,
  className,
  ...props
}: CardInfoSectionProps) {
  return (
    <div
      data-slot="card-info-section"
      className={cn('space-y-4 p-4', className)}
      {...props}
    >
      {/* 휴대폰 - 항상 표시 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground shrink-0 text-sm font-medium">
            휴대 전화
          </span>
          <span
            className={cn(
              'text-sm',
              info.phone ? 'text-foreground' : 'text-[#757575]'
            )}
          >
            {info.phone || '010-****-****'}
          </span>
        </div>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onPhoneClick}
          disabled={!info.phone}
        >
          <PhoneIcon className="size-4" />
        </IconButton>
      </div>

      {/* 이메일 - 항상 표시 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground shrink-0 text-sm font-medium">
            이메일
          </span>
          <span
            className={cn(
              'text-sm',
              info.email ? 'text-foreground' : 'text-[#757575]'
            )}
          >
            {info.email || 'email@domain.com'}
          </span>
        </div>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onEmailClick}
          disabled={!info.email}
        >
          <Copy className="size-4" />
        </IconButton>
      </div>

      {/* 유선전화 - 항상 표시 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground shrink-0 text-sm font-medium">
            유선 전화
          </span>
          <span
            className={cn(
              'text-sm',
              info.tel ? 'text-foreground' : 'text-[#757575]'
            )}
          >
            {info.tel || '02-***-****'}
          </span>
        </div>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onTelClick}
          disabled={!info.tel}
        >
          <PhoneCallIcon className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}

export { CardInfoSection }
export type { CardInfoSectionProps, CardInfo }
