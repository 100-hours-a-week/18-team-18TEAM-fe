'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { AxiosError } from 'axios'
import { useInView } from 'react-intersection-observer'
import { Header, Button, toast } from '@/shared'
import { useChatRoomMessages, useChatRooms } from '../api'
import { ChatMessageList } from './chat-message-list'
import { ChatComposer } from './chat-composer'

interface ChatRoomPageProps {
  roomId: string
}

function ChatRoomPage({ roomId }: ChatRoomPageProps) {
  const router = useRouter()
  const messageEndRef = React.useRef<HTMLDivElement | null>(null)
  const { ref, inView } = useInView({ rootMargin: '200px' })
  const [draft, setDraft] = React.useState('')

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
    other_user_id: room?.participant.id,
  })

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  const participantLabel = [room?.participant.company, room?.participant.position]
    .filter(Boolean)
    .join(' · ')

  const handleSendMessage = () => {
    toast.info('실시간 채팅 기능은 준비 중입니다.')
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        title={room?.participant.name || '채팅'}
        showClose
        onClose={() => router.replace('/chat')}
        rightContent={room && (
          <span className="text-muted-foreground text-xs">
            {room.participant.isOnline ? '온라인' : '오프라인'}
          </span>
        )}
      />

      <div className="flex min-h-screen flex-col pt-14">
        <div className="border-border border-b px-4 py-2">
          <p className="text-muted-foreground truncate text-xs">
            {participantLabel || '상대 프로필 정보 없음'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
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
              <Button
                variant="outline"
                onClick={() => void refetch()}
              >
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              <ChatMessageList messages={messages} />
              {hasNextPage && (
                <div ref={ref} className="h-4 w-full" aria-hidden>
                  {isFetchingNextPage && (
                    <div className="text-muted-foreground py-4 text-center text-sm">
                      이전 메시지를 불러오고 있어요...
                    </div>
                  )}
                </div>
              )}
              <div ref={messageEndRef} />
            </>
          )}
        </div>

        <p className="text-muted-foreground px-4 pb-1 text-xs">
          실시간 전송 기능은 STOMP 연동 단계에서 활성화됩니다.
        </p>
        <ChatComposer
          value={draft}
          onChange={setDraft}
          onSend={handleSendMessage}
          disabled
        />
      </div>
    </div>
  )
}

export { ChatRoomPage }
export type { ChatRoomPageProps }
