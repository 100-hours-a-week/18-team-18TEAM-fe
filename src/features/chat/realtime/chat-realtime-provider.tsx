'use client'

import * as React from 'react'
import type { IMessage, StompSubscription } from '@stomp/stompjs'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared'
import type {
  ChatRoomNotificationEvent,
  ChatSocketMessageEvent,
  SendChatMessagePayload,
} from '../model'
import {
  appendIncomingMessage,
  patchChatRoomNotification,
} from '../api'
import {
  CHAT_STOMP_NOTIFY_DEST,
  CHAT_STOMP_ROOM_SUB_PREFIX,
  CHAT_STOMP_SEND_DEST,
  createChatStompClient,
} from './stomp-client'

type RoomMessageListener = (event: ChatSocketMessageEvent) => void

interface RoomSubscriptionState {
  listeners: Set<RoomMessageListener>
  subscription: StompSubscription | null
}

interface ChatRealtimeContextValue {
  isConnected: boolean
  sendMessage: (payload: SendChatMessagePayload) => boolean
  subscribeRoom: (roomId: string, listener: RoomMessageListener) => () => void
}

const ChatRealtimeContext = React.createContext<ChatRealtimeContextValue | null>(
  null
)

function toPositiveInt(value: unknown): number | null {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function extractPayload(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object') return null

  const raw = input as Record<string, unknown>
  if (raw.data && typeof raw.data === 'object') {
    return raw.data as Record<string, unknown>
  }

  return raw
}

function toSocketMessageEvent(frame: IMessage): ChatSocketMessageEvent | null {
  const parsed = tryParseJson(frame.body)
  const payload = extractPayload(parsed)
  if (!payload) return null

  const roomId = toPositiveInt(payload.room_id ?? payload.roomId)
  const senderId = toPositiveInt(
    payload.sender_user_id ?? payload.senderUserId
  )

  if (!roomId || !senderId) return null

  return {
    room_id: roomId,
    message_id: toPositiveInt(payload.message_id ?? payload.messageId) ||
      undefined,
    sender_user_id: senderId,
    sender_name:
      typeof payload.sender_name === 'string'
        ? payload.sender_name
        : typeof payload.senderName === 'string'
          ? payload.senderName
          : undefined,
    content:
      typeof payload.content === 'string' ? payload.content : '',
    created_at:
      typeof payload.created_at === 'string'
        ? payload.created_at
        : typeof payload.createdAt === 'string'
          ? payload.createdAt
          : new Date().toISOString(),
  }
}

function toNotificationEvent(
  frame: IMessage
): ChatRoomNotificationEvent | null {
  const parsed = tryParseJson(frame.body)
  const payload = extractPayload(parsed)
  if (!payload) return null

  const roomId = toPositiveInt(payload.room_id ?? payload.roomId)
  if (!roomId) return null

  return {
    room_id: roomId,
    unread_count: Math.max(
      0,
      Number(payload.unread_count ?? payload.unreadCount ?? 0)
    ),
    latest_message:
      typeof payload.latest_message === 'string'
        ? payload.latest_message
        : typeof payload.latestMessage === 'string'
          ? payload.latestMessage
          : '',
    latest_message_created_at:
      typeof payload.latest_message_created_at === 'string'
        ? payload.latest_message_created_at
        : typeof payload.latestMessageCreatedAt === 'string'
          ? payload.latestMessageCreatedAt
          : new Date().toISOString(),
    other_user_id: toPositiveInt(payload.other_user_id ?? payload.otherUserId) ||
      undefined,
    other_user_name:
      typeof payload.other_user_name === 'string'
        ? payload.other_user_name
        : typeof payload.otherUserName === 'string'
          ? payload.otherUserName
          : undefined,
    other_user_profile_image_url:
      typeof payload.other_user_profile_image_url === 'string'
        ? payload.other_user_profile_image_url
        : typeof payload.otherUserProfileImageUrl === 'string'
          ? payload.otherUserProfileImageUrl
          : undefined,
  }
}

function normalizeRoomId(roomId: string): string {
  return roomId.trim()
}

export function ChatRealtimeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const clientRef = React.useRef<ReturnType<typeof createChatStompClient> | null>(
    null
  )
  const notifySubscriptionRef = React.useRef<StompSubscription | null>(null)
  const roomSubscriptionsRef = React.useRef<Map<string, RoomSubscriptionState>>(
    new Map()
  )
  const connectedRef = React.useRef(false)
  const lastErrorRef = React.useRef<{ message: string; at: number } | null>(
    null
  )

  const [isConnected, setIsConnected] = React.useState(false)

  const handleRealtimeError = React.useCallback((message: string) => {
    const now = Date.now()
    const last = lastErrorRef.current
    const shouldToast =
      !last ||
      last.message !== message ||
      now - last.at > 5_000

    if (shouldToast) {
      toast.error('채팅 연결에 문제가 발생했습니다.')
      lastErrorRef.current = { message, at: now }
    }
  }, [])

  const subscribeNotify = React.useCallback(() => {
    const client = clientRef.current
    if (!client || !client.connected) return

    notifySubscriptionRef.current?.unsubscribe()

    notifySubscriptionRef.current = client.subscribe(
      CHAT_STOMP_NOTIFY_DEST,
      (frame) => {
        const event = toNotificationEvent(frame)
        if (!event) return
        patchChatRoomNotification(queryClient, event)
      }
    )
  }, [queryClient])

  const ensureRoomSubscription = React.useCallback(
    (roomId: string) => {
      const normalizedRoomId = normalizeRoomId(roomId)
      if (!normalizedRoomId) return

      const client = clientRef.current
      if (!client || !client.connected || !connectedRef.current) return

      const roomState = roomSubscriptionsRef.current.get(normalizedRoomId)
      if (!roomState || roomState.subscription) return

      roomState.subscription = client.subscribe(
        `${CHAT_STOMP_ROOM_SUB_PREFIX}/${normalizedRoomId}`,
        (frame) => {
          const event = toSocketMessageEvent(frame)
          if (!event) return

          appendIncomingMessage(queryClient, event)

          const currentRoomState = roomSubscriptionsRef.current.get(
            normalizedRoomId
          )
          if (!currentRoomState) return

          for (const listener of currentRoomState.listeners) {
            listener(event)
          }
        }
      )
    },
    [queryClient]
  )

  const releaseRoomSubscription = React.useCallback((roomId: string) => {
    const normalizedRoomId = normalizeRoomId(roomId)
    const roomState = roomSubscriptionsRef.current.get(normalizedRoomId)
    if (!roomState) return

    roomState.subscription?.unsubscribe()
    roomSubscriptionsRef.current.delete(normalizedRoomId)
  }, [])

  const resubscribeRooms = React.useCallback(() => {
    for (const roomId of roomSubscriptionsRef.current.keys()) {
      const roomState = roomSubscriptionsRef.current.get(roomId)
      if (!roomState) continue
      roomState.subscription = null
      ensureRoomSubscription(roomId)
    }
  }, [ensureRoomSubscription])

  React.useEffect(() => {
    const client = createChatStompClient({
      onConnect: () => {
        connectedRef.current = true
        setIsConnected(true)
        subscribeNotify()
        resubscribeRooms()
      },
      onDisconnect: () => {
        connectedRef.current = false
        setIsConnected(false)

        notifySubscriptionRef.current = null
        for (const roomState of roomSubscriptionsRef.current.values()) {
          roomState.subscription = null
        }
      },
      onError: handleRealtimeError,
    })

    clientRef.current = client
    client.activate()

    return () => {
      connectedRef.current = false
      setIsConnected(false)

      notifySubscriptionRef.current?.unsubscribe()
      notifySubscriptionRef.current = null

      for (const roomState of roomSubscriptionsRef.current.values()) {
        roomState.subscription?.unsubscribe()
      }
      roomSubscriptionsRef.current.clear()

      void client.deactivate()
      clientRef.current = null
    }
  }, [handleRealtimeError, resubscribeRooms, subscribeNotify])

  const sendMessage = React.useCallback(
    (payload: SendChatMessagePayload): boolean => {
      const client = clientRef.current
      if (!client || !client.connected || !connectedRef.current) {
        return false
      }

      client.publish({
        destination: CHAT_STOMP_SEND_DEST,
        body: JSON.stringify(payload),
      })

      return true
    },
    []
  )

  const subscribeRoom = React.useCallback(
    (roomId: string, listener: RoomMessageListener) => {
      const normalizedRoomId = normalizeRoomId(roomId)
      if (!normalizedRoomId) {
        return () => {}
      }

      const existing = roomSubscriptionsRef.current.get(normalizedRoomId)
      if (existing) {
        existing.listeners.add(listener)
      } else {
        roomSubscriptionsRef.current.set(normalizedRoomId, {
          listeners: new Set([listener]),
          subscription: null,
        })
      }

      ensureRoomSubscription(normalizedRoomId)

      return () => {
        const roomState = roomSubscriptionsRef.current.get(normalizedRoomId)
        if (!roomState) return

        roomState.listeners.delete(listener)
        if (roomState.listeners.size > 0) return

        releaseRoomSubscription(normalizedRoomId)
      }
    },
    [ensureRoomSubscription, releaseRoomSubscription]
  )

  const value = React.useMemo<ChatRealtimeContextValue>(
    () => ({
      isConnected,
      sendMessage,
      subscribeRoom,
    }),
    [isConnected, sendMessage, subscribeRoom]
  )

  return (
    <ChatRealtimeContext.Provider value={value}>
      {children}
    </ChatRealtimeContext.Provider>
  )
}

export function useChatRealtime(): ChatRealtimeContextValue {
  const context = React.useContext(ChatRealtimeContext)
  if (!context) {
    throw new Error('useChatRealtime must be used within ChatRealtimeProvider.')
  }
  return context
}
