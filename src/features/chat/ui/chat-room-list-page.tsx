'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon, RefreshCcwIcon } from 'lucide-react'
import { Header, Button, EmptyState } from '@/shared'
import { Input } from '@/components/ui/input'
import { getMockChatRooms } from '../model'
import { ChatRoomListItem } from './chat-room-list-item'

function ChatRoomListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = React.useState('')

  const preview = searchParams.get('preview')
  const isLoading = preview === 'loading'
  const isError = preview === 'error'
  const forceEmpty = preview === 'empty'

  const rooms = React.useMemo(() => getMockChatRooms(), [])

  const filteredRooms = React.useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) return rooms

    return rooms.filter((room) => {
      const target = `${room.participant.name} ${room.lastMessagePreview}`
      return target.toLowerCase().includes(normalized)
    })
  }, [rooms, keyword])

  const visibleRooms = forceEmpty ? [] : filteredRooms

  return (
    <div className="bg-background min-h-screen">
      <Header title="채팅" showClose onClose={() => router.replace('/home')} />

      <div className="pt-14">
        <div className="border-border border-b px-4 py-3">
          <label className="relative block">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="이름 또는 메시지 검색"
              className="h-10 rounded-full pl-9"
              disabled={isLoading || isError}
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4">
            <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-muted-foreground text-sm">
              채팅방 목록을 불러오는 중...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4">
            <p className="text-foreground text-sm font-medium">
              채팅방 목록을 불러오지 못했습니다.
            </p>
            <Button
              variant="outline"
              onClick={() => router.replace('/chat')}
              leftIcon={<RefreshCcwIcon className="size-4" />}
            >
              다시 시도
            </Button>
          </div>
        ) : visibleRooms.length === 0 ? (
          <div className="px-4 py-6">
            <EmptyState
              title="채팅방이 없습니다"
              description="새 대화를 시작하면 채팅방이 생성됩니다."
            />
          </div>
        ) : (
          <div className="px-2 py-2 pb-8">
            {visibleRooms.map((room) => (
              <ChatRoomListItem
                key={room.id}
                room={room}
                onPress={(roomId) => router.push(`/chat/${roomId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { ChatRoomListPage }
