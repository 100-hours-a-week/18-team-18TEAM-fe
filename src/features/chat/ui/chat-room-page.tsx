'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { AxiosError } from 'axios'
import { useInView } from 'react-intersection-observer'
import { useQueryClient } from '@tanstack/react-query'
import { Header, Button, toast } from '@/shared'
import { useMyInfo } from '@/features/user'
import {
  markChatRoomRead,
  setChatRoomUnreadCount,
  useChatRoomMessages,
  useChatRooms,
} from '../api'
import type { ChatSocketMessageEvent } from '../model'
import { useChatRoomRealtime } from '../realtime'
import { ChatMessageList } from './chat-message-list'
import { ChatComposer } from './chat-composer'
import { useThrottleCallback } from './use-throttle-callback'

interface ChatRoomPageProps {
  roomId: string
}

interface HistoryFetchSnapshot {
  scrollTop: number
  scrollHeight: number
}

function ChatRoomPage({ roomId }: ChatRoomPageProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const messageEndRef = React.useRef<HTMLDivElement | null>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const isInitialScrollRef = React.useRef(true)
  const historyFetchSnapshotRef =
    React.useRef<HistoryFetchSnapshot | null>(null)
  const historyFetchPendingRef = React.useRef(false)
  const prevIsFetchingNextPageRef = React.useRef(false)
  const prevLastMessageIdRef = React.useRef<string | undefined>(undefined)
  const skipAutoScrollOnceRef = React.useRef(false)
  const { ref, inView } = useInView({ rootMargin: '200px' })

  const [draft, setDraft] = React.useState('')

  const { data: myInfo } = useMyInfo()

  const roomNumericId = React.useMemo(() => {
    const parsed = Number(roomId)
    if (!Number.isInteger(parsed) || parsed <= 0) return null
    return parsed
  }, [roomId])

  const { rooms } = useChatRooms({ size: 20 })
  const room = React.useMemo(
    () => rooms.find((item) => item.id === roomId) || null,
    [rooms, roomId]
  )

  const {
    messages,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useChatRoomMessages(roomId, {
    size: 20,
    my_user_id: myInfo?.id,
    other_user_id: room?.participant.id,
  })

  const scheduleMarkRoomRead = useThrottleCallback(() => {
    if (!roomNumericId) return

    void (async () => {
      try {
        await markChatRoomRead(roomNumericId)
        setChatRoomUnreadCount(queryClient, roomNumericId, 0)
      } catch {
        // 읽음 동기화 실패는 메시지 UX를 깨지 않기 위해 무시한다.
      }
    })()
  }, 300)

  const handleRoomMessage = React.useCallback(
    (event: ChatSocketMessageEvent) => {
      if (
        typeof myInfo?.id === 'number' &&
        event.sender_user_id === myInfo.id
      ) {
        return
      }
      scheduleMarkRoomRead()
    },
    [myInfo?.id, scheduleMarkRoomRead]
  )

  const { isConnected, publishMessage } = useChatRoomRealtime(
    roomId,
    handleRoomMessage
  )

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      const container = scrollContainerRef.current
      if (container) {
        historyFetchSnapshotRef.current = {
          scrollTop: container.scrollTop,
          scrollHeight: container.scrollHeight,
        }
        historyFetchPendingRef.current = true
      } else {
        historyFetchSnapshotRef.current = null
        historyFetchPendingRef.current = false
      }
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  React.useLayoutEffect(() => {
    const didFinishHistoryFetch =
      prevIsFetchingNextPageRef.current && !isFetchingNextPage
    prevIsFetchingNextPageRef.current = isFetchingNextPage

    if (!didFinishHistoryFetch || !historyFetchPendingRef.current) {
      return
    }

    const container = scrollContainerRef.current
    const snapshot = historyFetchSnapshotRef.current

    historyFetchPendingRef.current = false
    historyFetchSnapshotRef.current = null
    skipAutoScrollOnceRef.current = true

    if (!container || !snapshot) return

    const heightDelta = container.scrollHeight - snapshot.scrollHeight
    container.scrollTop =
      heightDelta > 0 ? snapshot.scrollTop + heightDelta : snapshot.scrollTop
  }, [isFetchingNextPage, messages])

  React.useEffect(() => {
    if (!messages.length) return

    const lastId = messages[messages.length - 1]?.id

    // Case A: 최초 진입 → 맨 아래로 즉시 스크롤
    if (isInitialScrollRef.current && !isLoading) {
      prevLastMessageIdRef.current = lastId
      messageEndRef.current?.scrollIntoView({ behavior: 'instant' })
      isInitialScrollRef.current = false
      return
    }

    if (skipAutoScrollOnceRef.current) {
      skipAutoScrollOnceRef.current = false
      prevLastMessageIdRef.current = lastId
      return
    }

    const prevLastId = prevLastMessageIdRef.current
    prevLastMessageIdRef.current = lastId

    // 마지막 메시지 ID가 바뀐 경우만 신규 append로 간주한다.
    if (!lastId || !prevLastId || lastId === prevLastId) return

    // 새 WebSocket 메시지 (마지막에 append) → 아래 근방이면 자동 스크롤
    const container = scrollContainerRef.current
    if (!container) return
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150
    if (isNearBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  React.useEffect(() => {
    if ((room?.unreadCount ?? 0) > 0) {
      scheduleMarkRoomRead()
    }
  }, [room?.unreadCount, scheduleMarkRoomRead])

  const status = (error as AxiosError | null)?.response?.status
  const isNotFound = status === 404

  if (isNotFound) {
    return (
      <div className="bg-background min-h-screen">
        <Header
          title="채팅"
          showClose
          onClose={() => router.replace('/chat')}
        />
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 pt-14">
          <p className="text-foreground text-sm font-medium">
            존재하지 않는 채팅방입니다.
          </p>
          <Button variant="outline" onClick={() => router.replace('/chat')}>
            목록으로 이동
          </Button>
        </div>
      </div>
    )
  }

  const participantLabel = [
    room?.participant.company,
    room?.participant.position,
  ]
    .filter(Boolean)
    .join(' · ')

  const handleSendMessage = () => {
    const content = draft.trim()
    if (!content) return

    if (!roomNumericId) {
      toast.error('채팅방 정보를 확인할 수 없습니다.')
      return
    }

    const published = publishMessage({
      room_id: roomNumericId,
      content,
    })

    if (!published) {
      toast.error('채팅 연결 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setDraft('')
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        title={room?.participant.name || '채팅'}
        titleAlign="center"
        showClose
        onClose={() => router.replace('/chat')}
        rightContent={
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span
              className={`block size-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </span>
        }
      />

      <div className="flex min-h-screen flex-col pt-14">
        {/* <div className="border-border border-b px-4 py-2">
          <p className="text-muted-foreground truncate text-xs">
            {participantLabel || '상대 프로필 정보 없음'}
          </p>
        </div> */}

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 pb-22"
        >
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
              <p className="text-muted-foreground text-sm">
                메시지를 불러오는 중...
              </p>
            </div>
          ) : isError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <p className="text-foreground text-sm font-medium">
                메시지를 불러오지 못했습니다.
              </p>
              <Button variant="outline" onClick={() => void refetch()}>
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              {hasNextPage && (
                <div ref={ref} className="h-1 w-full" aria-hidden />
              )}
              {isFetchingNextPage && (
                <div className="text-muted-foreground py-4 text-center text-sm">
                  이전 메시지를 불러오고 있어요...
                </div>
              )}
              <ChatMessageList messages={messages} />
              <div ref={messageEndRef} />
            </>
          )}
        </div>

        {!isConnected && (
          <p className="text-muted-foreground fixed bottom-20 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-4 text-xs">
            채팅 서버에 연결 중입니다...
          </p>
        )}

        <ChatComposer
          value={draft}
          onChange={setDraft}
          onSend={handleSendMessage}
          disabled={!isConnected || !roomNumericId}
        />
      </div>
    </div>
  )
}

export { ChatRoomPage }
export type { ChatRoomPageProps }
