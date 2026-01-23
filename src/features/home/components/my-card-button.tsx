'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/shared'

interface MyCardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  avatarSrc?: string | null
}

function MyCardButton({ avatarSrc, className, ...props }: MyCardButtonProps) {
  return (
    <button
      type="button"
      data-slot="my-card-button"
      className={cn(
        'focus:ring-ring rounded-full transition-transform hover:scale-105 focus:ring-2 focus:outline-none',
        className
      )}
      aria-label="내 명함 보기"
      {...props}
    >
      <Avatar src={avatarSrc} size="default" />
    </button>
  )
}

export { MyCardButton }
export type { MyCardButtonProps }
