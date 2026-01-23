'use client'

import * as React from 'react'
import { AlertCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface LoginErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  onRetry?: () => void
}

function LoginErrorState({
  message = '로그인에 실패했습니다. 다시 시도해주세요.',
  onRetry,
  className,
  ...props
}: LoginErrorStateProps) {
  return (
    <div
      data-slot="login-error-state"
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
      {...props}
    >
      <div className="bg-destructive/10 text-destructive mb-4 flex size-16 items-center justify-center rounded-full">
        <AlertCircleIcon className="size-8" />
      </div>

      <h3 className="text-foreground mb-2 text-lg font-semibold">
        로그인 실패
      </h3>

      <p className="text-muted-foreground mb-6 text-sm">{message}</p>

      {onRetry && (
        <Button type="button" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}

export { LoginErrorState }
export type { LoginErrorStateProps }
