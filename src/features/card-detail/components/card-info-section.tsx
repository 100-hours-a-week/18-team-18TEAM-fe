'use client'

import * as React from 'react'
import { PhoneIcon, MailIcon, PhoneCallIcon } from 'lucide-react'
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
      {info.phone && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PhoneIcon className="text-muted-foreground size-5" />
            <span className="text-foreground text-sm">{info.phone}</span>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onPhoneClick}>
            <PhoneIcon className="size-4" />
          </IconButton>
        </div>
      )}

      {info.email && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MailIcon className="text-muted-foreground size-5" />
            <span className="text-foreground text-sm">{info.email}</span>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onEmailClick}>
            <MailIcon className="size-4" />
          </IconButton>
        </div>
      )}

      {info.tel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PhoneCallIcon className="text-muted-foreground size-5" />
            <span className="text-foreground text-sm">{info.tel}</span>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onTelClick}>
            <PhoneCallIcon className="size-4" />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export { CardInfoSection }
export type { CardInfoSectionProps, CardInfo }
