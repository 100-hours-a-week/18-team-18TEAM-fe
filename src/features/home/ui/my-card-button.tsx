'use client'

import * as React from 'react'
import { UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/shared'

type MyCardButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function MyCardButton({ className, ...props }: MyCardButtonProps) {
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
      <Avatar size="default" fallback={<UserIcon className="size-1/2" />} />
    </button>
  )
}

export { MyCardButton }
export type { MyCardButtonProps }
