'use client'

import * as React from 'react'
import { SendHorizonalIcon } from 'lucide-react'
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
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const canSend = value.trim().length > 0 && !disabled
  const maxLines = 6

  const resizeTextarea = React.useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'

    const styles = window.getComputedStyle(textarea)
    const lineHeight = Number.parseFloat(styles.lineHeight) || 20
    const verticalPadding =
      (Number.parseFloat(styles.paddingTop) || 0) +
      (Number.parseFloat(styles.paddingBottom) || 0)
    const verticalBorder =
      (Number.parseFloat(styles.borderTopWidth) || 0) +
      (Number.parseFloat(styles.borderBottomWidth) || 0)
    const maxHeight = Math.ceil(
      lineHeight * maxLines + verticalPadding + verticalBorder
    )

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [maxLines])

  React.useEffect(() => {
    resizeTextarea()
  }, [value, resizeTextarea])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSend) return
    onSend()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') return
    if (event.shiftKey || event.nativeEvent.isComposing) return

    event.preventDefault()
    if (!canSend) return
    onSend()
  }

  return (
    <form
      className={cn(
        'border-border bg-background fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t p-3',
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          maxLength={1000}
          disabled={disabled}
          rows={1}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 w-full rounded-2xl border px-4 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            'min-h-10 resize-none overflow-y-hidden'
          )}
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
