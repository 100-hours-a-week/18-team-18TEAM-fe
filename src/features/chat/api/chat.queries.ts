'use client'

import * as React from 'react'
import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query'
import type {
  ChatMessage,
  ChatRoomNotificationEvent,
  ChatRoomSummary,
  ChatSocketMessageEvent,
} from '../model'
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
  my_user_id?: number
}

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

function toPositiveInt(value: unknown): number | null {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) return null
  return parsed
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
  myUserId?: number,
  otherUserId?: number,
  otherLastReadMessageId?: string | null
): ChatMessage {
  const isReceived =
    typeof myUserId === 'number'
      ? message.sender_user_id !== myUserId
      : typeof otherUserId === 'number'
        ? message.sender_user_id === otherUserId
        : true

  let isRead: boolean
  if (isReceived) {
    isRead = true
  } else if (otherLastReadMessageId == null) {
    isRead = false
  } else {
    isRead =
      BigInt(message.message_id) <= BigInt(otherLastReadMessageId)
  }

  return {
    id: message.message_id,
    roomId,
    senderId: message.sender_user_id,
    senderName: message.sender_name || '알 수 없음',
    content: message.content || '',
    sentAt: message.created_at || new Date(0).toISOString(),
    direction: isReceived ? 'received' : 'sent',
    isRead,
  }
}

function toSocketMessageData(
  event: ChatSocketMessageEvent
): ChatMessageData | null {
  const roomId = toPositiveInt(event.room_id)
  const senderId = toPositiveInt(event.sender_user_id)

  if (!roomId || !senderId) return null

  return {
    message_id: event.message_id ?? String(Date.now()),
    room_id: roomId,
    sender_user_id: senderId,
    sender_name: event.sender_name || '알 수 없음',
    content: event.content || '',
    created_at: event.created_at || new Date().toISOString(),
  }
}

function toNotificationRoomPatch(
  event: ChatRoomNotificationEvent
): Partial<ChatRoomSummaryData> | null {
  const roomId = toPositiveInt(event.room_id)
  if (!roomId) return null

  return {
    room_id: roomId,
    unread_count: Math.max(0, Number(event.unread_count) || 0),
    latest_message_content: event.latest_message || '',
    latest_message_created_at:
      event.latest_message_created_at || new Date().toISOString(),
    ...(toPositiveInt(event.other_user_id) && {
      other_user_id: toPositiveInt(event.other_user_id) as number,
    }),
    ...(event.other_user_name && {
      other_user_name: event.other_user_name,
    }),
    ...(typeof event.other_user_profile_image_url === 'string' && {
      other_user_profile_image_url: event.other_user_profile_image_url,
    }),
  }
}

function upsertRoomToTop(
  pages: GetChatRoomsResponse[],
  roomPatch: Partial<ChatRoomSummaryData>
) {
  const roomId = toPositiveInt(roomPatch.room_id)
  if (!roomId) return

  let mergedRoom: ChatRoomSummaryData | null = null

  for (const page of pages) {
    const index = page.data.findIndex((room) => room.room_id === roomId)
    if (index < 0) continue

    mergedRoom = {
      ...page.data[index],
      ...roomPatch,
      room_id: roomId,
    }

    page.data.splice(index, 1)
    break
  }

  if (!mergedRoom) {
    mergedRoom = {
      room_id: roomId,
      other_user_id: toPositiveInt(roomPatch.other_user_id) || 0,
      other_user_name: roomPatch.other_user_name || '알 수 없는 사용자',
      other_user_profile_image_url:
        roomPatch.other_user_profile_image_url || '',
      latest_message_content: roomPatch.latest_message_content || '',
      latest_message_created_at:
        roomPatch.latest_message_created_at || new Date().toISOString(),
      unread_count: Math.max(0, Number(roomPatch.unread_count) || 0),
    }
  }

  pages[0].data = [mergedRoom, ...pages[0].data].sort(
    (a, b) =>
      toTimestamp(b.latest_message_created_at) -
      toTimestamp(a.latest_message_created_at)
  )
}

function updateRoomInPlace(
  pages: GetChatRoomsResponse[],
  roomId: number,
  updater: (room: ChatRoomSummaryData) => ChatRoomSummaryData
): boolean {
  for (const page of pages) {
    const index = page.data.findIndex((room) => room.room_id === roomId)
    if (index < 0) continue
    page.data[index] = updater(page.data[index])
    return true
  }

  return false
}

function isDuplicateMessage(
  existing: ChatMessageData,
  incoming: ChatMessageData,
  originalEvent: ChatSocketMessageEvent
): boolean {
  if (originalEvent.message_id) {
    return existing.message_id === incoming.message_id
  }

  return (
    existing.room_id === incoming.room_id &&
    existing.sender_user_id === incoming.sender_user_id &&
    existing.content === incoming.content &&
    existing.created_at === incoming.created_at
  )
}

export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  roomList: (params: ChatRoomsQueryParams = {}) =>
    [...chatKeys.rooms(), params] as const,
  messages: () => [...chatKeys.all, 'messages'] as const,
  messageList: (
    roomId: string,
    params: Omit<ChatMessagesQueryParams, 'other_user_id' | 'my_user_id'> = {}
  ) => [...chatKeys.messages(), roomId, params] as const,
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
    const pages = query.data?.pages
    const otherLastReadMessageId =
      pages?.[0]?.data.other_last_read_message_id ?? null

    const flattened =
      pages?.flatMap((page) =>
        page.data.messages.map((message) =>
          toChatMessage(
            message,
            roomId,
            params.my_user_id,
            params.other_user_id,
            otherLastReadMessageId
          )
        )
      ) ?? []

    // ID 기반 중복 제거 (첫 번째 등장만 유지)
    const seen = new Set<string>()
    const unique = flattened.filter((msg) => {
      if (seen.has(msg.id)) return false
      seen.add(msg.id)
      return true
    })

    return unique.sort(
      (a, b) => toTimestamp(a.sentAt) - toTimestamp(b.sentAt)
    )
  }, [query.data, roomId, params.my_user_id, params.other_user_id])

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

      upsertRoomToTop(nextPages, room)

      return {
        ...previous,
        pages: nextPages,
      }
    }
  )
}

export function patchChatRoomNotification(
  queryClient: QueryClient,
  notification: ChatRoomNotificationEvent
) {
  const roomPatch = toNotificationRoomPatch(notification)
  if (!roomPatch) return

  queryClient.setQueriesData<InfiniteData<GetChatRoomsResponse>>(
    { queryKey: chatKeys.rooms(), exact: false },
    (previous) => {
      if (!previous || previous.pages.length === 0) return previous

      const nextPages = previous.pages.map((page) => ({
        ...page,
        data: [...page.data],
      }))

      upsertRoomToTop(nextPages, roomPatch)

      return {
        ...previous,
        pages: nextPages,
      }
    }
  )
}

export function appendIncomingMessage(
  queryClient: QueryClient,
  event: ChatSocketMessageEvent
) {
  const incoming = toSocketMessageData(event)
  if (!incoming) return

  const roomKey = String(incoming.room_id)

  queryClient.setQueriesData<InfiniteData<GetChatRoomMessagesResponse>>(
    { queryKey: [...chatKeys.messages(), roomKey], exact: false },
    (previous) => {
      if (!previous || previous.pages.length === 0) return previous

      const nextPages = previous.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          messages: [...page.data.messages],
        },
      }))

      const hasDuplicate = nextPages.some((page) =>
        page.data.messages.some((message) =>
          isDuplicateMessage(message, incoming, event)
        )
      )

      if (hasDuplicate) {
        return previous
      }

      nextPages[0].data.messages = [...nextPages[0].data.messages, incoming]

      return {
        ...previous,
        pages: nextPages,
      }
    }
  )

  queryClient.setQueriesData<InfiniteData<GetChatRoomsResponse>>(
    { queryKey: chatKeys.rooms(), exact: false },
    (previous) => {
      if (!previous || previous.pages.length === 0) return previous

      const nextPages = previous.pages.map((page) => ({
        ...page,
        data: [...page.data],
      }))

      upsertRoomToTop(nextPages, {
        room_id: incoming.room_id,
        latest_message_content: incoming.content,
        latest_message_created_at: incoming.created_at,
      })

      return {
        ...previous,
        pages: nextPages,
      }
    }
  )
}

export function setChatRoomUnreadCount(
  queryClient: QueryClient,
  roomId: string | number,
  unreadCount: number
) {
  const targetRoomId = toPositiveInt(roomId)
  if (!targetRoomId) return

  queryClient.setQueriesData<InfiniteData<GetChatRoomsResponse>>(
    { queryKey: chatKeys.rooms(), exact: false },
    (previous) => {
      if (!previous || previous.pages.length === 0) return previous

      const nextPages = previous.pages.map((page) => ({
        ...page,
        data: [...page.data],
      }))

      const found = updateRoomInPlace(nextPages, targetRoomId, (room) => ({
        ...room,
        unread_count: Math.max(0, unreadCount),
      }))

      if (!found) return previous

      return {
        ...previous,
        pages: nextPages,
      }
    }
  )
}

export function updateOtherLastReadMessageId(
  queryClient: QueryClient,
  roomId: string | number,
  lastReadMessageId: string
) {
  const roomKey = String(roomId)

  queryClient.setQueriesData<InfiniteData<GetChatRoomMessagesResponse>>(
    { queryKey: [...chatKeys.messages(), roomKey], exact: false },
    (previous) => {
      if (!previous || previous.pages.length === 0) return previous

      const currentValue =
        previous.pages[0].data.other_last_read_message_id
      if (
        currentValue != null &&
        BigInt(lastReadMessageId) <= BigInt(currentValue)
      )
        return previous

      const nextPages = previous.pages.map((page, index) => {
        if (index !== 0) return page
        return {
          ...page,
          data: {
            ...page.data,
            other_last_read_message_id: lastReadMessageId,
          },
        }
      })

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
