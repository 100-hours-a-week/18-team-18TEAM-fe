'use client'

import * as React from 'react'
import { SendHorizonalIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/shared'
import { cn } from '@/lib/utils'

interface ChatComposerProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onChange'
> {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

function ChatComposer({
  value,
  onChange,
  onSend,
  disabled = false,
  className,
  ...props
}: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !disabled

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend) return
    onSend()
  }

  return (
    <form
      className={cn('border-border bg-background border-t p-3', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={1000}
          disabled={disabled}
          className="h-10 rounded-full"
        />
        <Button
          type="submit"
          size="icon"
          variant="primary"
          disabled={!canSend}
          aria-label="전송"
          className="size-10 rounded-full"
        >
          <SendHorizonalIcon className="size-4" />
        </Button>
      </div>
    </form>
  )
}

export { ChatComposer }
export type { ChatComposerProps }
