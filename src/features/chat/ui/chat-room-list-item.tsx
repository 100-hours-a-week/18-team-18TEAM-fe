'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ChatRoomSummary } from '../model'
import { formatListTime } from './chat-format'

interface ChatRoomListItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  room: ChatRoomSummary
  onPress?: (roomId: string) => void
}

function ChatRoomListItem({
  room,
  onPress,
  className,
  ...props
}: ChatRoomListItemProps) {
  return (
    <button
      type="button"
      className={cn(
        'hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
        className
      )}
      onClick={() => onPress?.(room.id)}
      {...props}
    >
      <div className="relative">
        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full text-sm font-semibold">
          {room.participant.name.charAt(0)}
        </div>
        {room.participant.isOnline && (
          <span className="border-background absolute right-0 bottom-0 block size-2.5 rounded-full border bg-green-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-foreground truncate text-sm font-semibold">
            {room.participant.name}
          </p>
          <p className="text-muted-foreground shrink-0 text-xs">
            {formatListTime(room.lastMessageAt)}
          </p>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-muted-foreground truncate text-sm">
            {room.lastMessagePreview}
          </p>
          {room.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold">
              {room.unreadCount > 99 ? '99+' : room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export { ChatRoomListItem }
export type { ChatRoomListItemProps }
