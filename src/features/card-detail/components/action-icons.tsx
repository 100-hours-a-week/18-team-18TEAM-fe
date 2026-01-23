'use client'

import * as React from 'react'
import { PhoneIcon, MailIcon, MessageSquareIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from '@/shared'

interface ActionIconsProps extends React.HTMLAttributes<HTMLDivElement> {
  onPhone?: () => void
  onEmail?: () => void
  onMessage?: () => void
}

function ActionIcons({
  onPhone,
  onEmail,
  onMessage,
  className,
  ...props
}: ActionIconsProps) {
  return (
    <div
      data-slot="action-icons"
      className={cn('flex items-center gap-4', className)}
      {...props}
    >
      <IconButton
        variant="ghost"
        size="default"
        onClick={onPhone}
        aria-label="전화하기"
      >
        <PhoneIcon className="size-5" />
      </IconButton>

      <IconButton
        variant="ghost"
        size="default"
        onClick={onEmail}
        aria-label="이메일 보내기"
      >
        <MailIcon className="size-5" />
      </IconButton>

      <IconButton
        variant="ghost"
        size="default"
        onClick={onMessage}
        aria-label="메시지 보내기"
      >
        <MessageSquareIcon className="size-5" />
      </IconButton>
    </div>
  )
}

export { ActionIcons }
export type { ActionIconsProps }
