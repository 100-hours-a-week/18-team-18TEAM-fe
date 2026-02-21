'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '../model'
import { formatMessageTime } from './chat-format'

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[]
}

function ChatMessageList({
  messages,
  className,
  ...props
}: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex h-full items-center justify-center text-sm',
          className
        )}
        {...props}
      >
        아직 대화가 없습니다. 먼저 메시지를 보내보세요.
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      {messages.map((message) => {
        const isSent = message.direction === 'sent'

        return (
          <div
            key={message.id}
            className={cn('flex', isSent ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[78%]',
                isSent ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  'rounded-2xl px-3.5 py-2.5 text-sm leading-5 break-words',
                  isSent
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                )}
              >
                {message.content}
              </div>
              <div
                className={cn(
                  'text-muted-foreground mt-1 flex items-center gap-1 px-1 text-[11px]',
                  isSent ? 'justify-end' : 'justify-start'
                )}
              >
                {isSent && <span>{message.isRead ? '읽음' : '전송됨'}</span>}
                <span>{formatMessageTime(message.sentAt)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ChatMessageList }
export type { ChatMessageListProps }
