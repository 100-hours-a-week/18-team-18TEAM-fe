'use client'

import * as React from 'react'
import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import type { ChatMessage, ChatRoomSummary } from '../model'
import {
  getChatRoomMessages,
  getChatRooms,
  type ChatMessageData,
  type ChatRoomSummaryData,
  type GetChatRoomMessagesParams,
  type GetChatRoomMessagesResponse,
  type GetChatRoomsParams,
  type GetChatRoomsResponse,
} from './chat.api'

const DEFAULT_CHAT_PAGE_SIZE = 20

type ChatRoomsQueryParams = Omit<GetChatRoomsParams, 'cursorId'>
type ChatMessagesQueryParams = Omit<GetChatRoomMessagesParams, 'cursorId'> & {
  other_user_id?: number
}

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

function toChatRoomSummary(room: ChatRoomSummaryData): ChatRoomSummary {
  return {
    id: String(room.room_id),
    participant: {
      id: room.other_user_id,
      name: room.other_user_name || '알 수 없는 사용자',
      avatarUrl: room.other_user_profile_image_url || null,
      isOnline: false,
    },
    lastMessagePreview: room.latest_message_content || '',
    lastMessageAt:
      room.latest_message_created_at || new Date(0).toISOString(),
    unreadCount: room.unread_count ?? 0,
  }
}

function toChatMessage(
  message: ChatMessageData,
  roomId: string,
  otherUserId?: number
): ChatMessage {
  const isReceived =
    typeof otherUserId === 'number'
      ? message.sender_user_id === otherUserId
      : true

  return {
    id: String(message.message_id),
    roomId,
    senderId: message.sender_user_id,
    senderName: message.sender_name || '알 수 없음',
    content: message.content || '',
    sentAt: message.created_at || new Date(0).toISOString(),
    direction: isReceived ? 'received' : 'sent',
    isRead: !isReceived,
  }
}

export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  roomList: (params: ChatRoomsQueryParams = {}) =>
    [...chatKeys.rooms(), params] as const,
  messages: () => [...chatKeys.all, 'messages'] as const,
  messageList: (roomId: string, params: Omit<ChatMessagesQueryParams, 'other_user_id'> = {}) =>
    [...chatKeys.messages(), roomId, params] as const,
}

export function useChatRooms(params: ChatRoomsQueryParams = {}) {
  const queryParams = React.useMemo(
    () => ({ size: params.size ?? DEFAULT_CHAT_PAGE_SIZE }),
    [params.size]
  )

  const query = useInfiniteQuery({
    queryKey: chatKeys.roomList(queryParams),
    queryFn: ({ pageParam }) =>
      getChatRooms({
        ...queryParams,
        cursorId: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.has_next ? lastPage.pagination.cursorId : undefined,
    refetchOnWindowFocus: false,
  })

  const rooms = React.useMemo(
    () =>
      query.data?.pages.flatMap((page) => page.data.map(toChatRoomSummary)) ??
      [],
    [query.data]
  )

  return {
    ...query,
    rooms,
  }
}

export function useChatRoomMessages(
  roomId: string,
  params: ChatMessagesQueryParams = {}
) {
  const queryParams = React.useMemo(
    () => ({ size: params.size ?? DEFAULT_CHAT_PAGE_SIZE }),
    [params.size]
  )

  const query = useInfiniteQuery({
    queryKey: chatKeys.messageList(roomId, queryParams),
    queryFn: ({ pageParam }) =>
      getChatRoomMessages(roomId, {
        ...queryParams,
        cursorId: pageParam as number | undefined,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.has_next ? lastPage.pagination.cursorId : undefined,
    enabled: Boolean(roomId),
    refetchOnWindowFocus: false,
  })

  const messages = React.useMemo(() => {
    const flattened =
      query.data?.pages.flatMap((page) =>
        page.data.map((message) =>
          toChatMessage(message, roomId, params.other_user_id)
        )
      ) ?? []

    return [...flattened].sort(
      (a, b) => toTimestamp(a.sentAt) - toTimestamp(b.sentAt)
    )
  }, [query.data, roomId, params.other_user_id])

  return {
    ...query,
    messages,
  }
}

export function patchChatRoomLatestMessage(
  queryClient: QueryClient,
  room: ChatRoomSummaryData
) {
  queryClient.setQueriesData<InfiniteData<GetChatRoomsResponse>>(
    { queryKey: chatKeys.rooms(), exact: false },
    (previous) => {
      if (!previous || previous.pages.length === 0) return previous

      const nextPages = previous.pages.map((page) => ({
        ...page,
        data: [...page.data],
      }))

      let found = false
      for (const page of nextPages) {
        const index = page.data.findIndex((item) => item.room_id === room.room_id)
        if (index >= 0) {
          page.data[index] = { ...page.data[index], ...room }
          found = true
          break
        }
      }

      if (!found) {
        nextPages[0].data = [room, ...nextPages[0].data]
      }

      nextPages[0].data = [...nextPages[0].data].sort(
        (a, b) =>
          toTimestamp(b.latest_message_created_at) -
          toTimestamp(a.latest_message_created_at)
      )

      return {
        ...previous,
        pages: nextPages,
      }
    }
  )
}

export type {
  ChatMessagesQueryParams,
  ChatRoomsQueryParams,
  GetChatRoomMessagesResponse,
  GetChatRoomsResponse,
}
