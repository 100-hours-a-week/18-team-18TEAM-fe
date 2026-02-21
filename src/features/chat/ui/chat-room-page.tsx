'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header, Button } from '@/shared'
import type { ChatMessage } from '../model'
import { getMockRoomState } from '../model'
import { ChatMessageList } from './chat-message-list'
import { ChatComposer } from './chat-composer'

interface ChatRoomPageProps {
  roomId: string
}

function ChatRoomPage({ roomId }: ChatRoomPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messageEndRef = React.useRef<HTMLDivElement | null>(null)

  const preview = searchParams.get('preview')
  const isLoading = preview === 'loading'
  const isError = preview === 'error'
  const forceEmpty = preview === 'empty'

  const roomState = React.useMemo(() => getMockRoomState(roomId), [roomId])
  const [draft, setDraft] = React.useState('')
  const [messages, setMessages] = React.useState<ChatMessage[]>(
    forceEmpty ? [] : (roomState?.messages ?? [])
  )

  React.useEffect(() => {
    setMessages(forceEmpty ? [] : (roomState?.messages ?? []))
  }, [roomId, roomState, forceEmpty])

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!roomState) {
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

  const { room } = roomState
  const participantLabel = [room.participant.company, room.participant.position]
    .filter(Boolean)
    .join(' · ')

  const handleSendMessage = () => {
    const content = draft.trim()
    if (!content) return

    const nextMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      roomId: room.id,
      senderId: 100,
      senderName: '나',
      content,
      sentAt: new Date().toISOString(),
      direction: 'sent',
      isRead: false,
    }

    setMessages((prev) => [...prev, nextMessage])
    setDraft('')
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        title={room.participant.name}
        showClose
        onClose={() => router.replace('/chat')}
        rightContent={
          <span className="text-muted-foreground text-xs">
            {room.participant.isOnline ? '온라인' : '오프라인'}
          </span>
        }
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
                onClick={() => router.replace(`/chat/${roomId}`)}
              >
                다시 시도
              </Button>
            </div>
          ) : (
            <>
              <ChatMessageList messages={messages} />
              <div ref={messageEndRef} />
            </>
          )}
        </div>

        <ChatComposer
          value={draft}
          onChange={setDraft}
          onSend={handleSendMessage}
          disabled={isLoading || isError}
        />
      </div>
    </div>
  )
}

export { ChatRoomPage }
export type { ChatRoomPageProps }
