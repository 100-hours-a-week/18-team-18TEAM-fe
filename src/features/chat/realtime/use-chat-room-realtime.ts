'use client'

import * as React from 'react'
import type { ChatSocketMessageEvent, SendChatMessagePayload } from '../model'
import { useChatRealtime } from './chat-realtime-provider'

export function useChatRoomRealtime(
  roomId: string,
  onMessage?: (event: ChatSocketMessageEvent) => void
) {
  const { isConnected, sendMessage, subscribeRoom } = useChatRealtime()

  React.useEffect(() => {
    if (!onMessage) return
    return subscribeRoom(roomId, onMessage)
  }, [roomId, onMessage, subscribeRoom])

  const publishMessage = React.useCallback(
    (payload: SendChatMessagePayload): boolean => {
      return sendMessage(payload)
    },
    [sendMessage]
  )

  return {
    isConnected,
    publishMessage,
  }
}
