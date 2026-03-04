'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon, RefreshCcwIcon } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { Header, Button, EmptyState } from '@/shared'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useChatRooms } from '../api'
import { ChatRoomListItem } from './chat-room-list-item'

const SEARCH_MAX_LENGTH = 50

function ChatRoomListPage() {
  const router = useRouter()
  const [keyword, setKeyword] = React.useState('')
  const [isSearchInputFocused, setIsSearchInputFocused] = React.useState(false)
  const [isSearchLimitFeedback, setIsSearchLimitFeedback] =
    React.useState(false)
  const searchLimitFeedbackTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const { ref, inView } = useInView({ rootMargin: '200px' })

  const {
    rooms,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useChatRooms({ size: 20 })

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleKeywordChange = (value: string) => {
    setKeyword(value.slice(0, SEARCH_MAX_LENGTH))
  }

  const triggerSearchLimitFeedback = React.useCallback(() => {
    setIsSearchLimitFeedback(false)
    requestAnimationFrame(() => {
      setIsSearchLimitFeedback(true)
    })

    if (searchLimitFeedbackTimeoutRef.current) {
      clearTimeout(searchLimitFeedbackTimeoutRef.current)
    }

    searchLimitFeedbackTimeoutRef.current = setTimeout(() => {
      setIsSearchLimitFeedback(false)
    }, 320)
  }, [])

  React.useEffect(() => {
    return () => {
      if (searchLimitFeedbackTimeoutRef.current) {
        clearTimeout(searchLimitFeedbackTimeoutRef.current)
      }
    }
  }, [])

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.nativeEvent.isComposing) return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key.length !== 1) return

    const input = event.currentTarget
    const selectionStart = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? selectionStart
    const nextLength = keyword.length - (selectionEnd - selectionStart) + 1

    if (nextLength > SEARCH_MAX_LENGTH) {
      triggerSearchLimitFeedback()
    }
  }

  const handleSearchPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text')
    if (!pastedText) return

    const input = event.currentTarget
    const selectionStart = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? selectionStart
    const nextLength =
      keyword.length - (selectionEnd - selectionStart) + pastedText.length

    if (nextLength > SEARCH_MAX_LENGTH) {
      triggerSearchLimitFeedback()
    }
  }

  const filteredRooms = React.useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) return rooms

    return rooms.filter((room) => {
      const target = `${room.participant.name} ${room.lastMessagePreview}`
      return target.toLowerCase().includes(normalized)
    })
  }, [rooms, keyword])

  return (
    <div className="bg-background min-h-screen">
      <Header title="채팅" showClose onClose={() => router.replace('/home')} />

      <div className="pt-14">
        <div className="border-border border-b px-4 py-3">
          <label
            className={cn(
              'relative block',
              isSearchLimitFeedback && 'animate-search-limit-shake'
            )}
          >
            <SearchIcon
              className={cn(
                'text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2',
                isSearchLimitFeedback && 'text-destructive'
              )}
            />
            <Input
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              onPaste={handleSearchPaste}
              onFocus={() => setIsSearchInputFocused(true)}
              onBlur={() => setIsSearchInputFocused(false)}
              maxLength={SEARCH_MAX_LENGTH}
              placeholder="이름 검색"
              className={cn(
                'h-10 rounded-full pl-9',
                isSearchLimitFeedback &&
                  '!border-destructive bg-destructive/5 focus-visible:!border-destructive focus-visible:!ring-destructive/30'
              )}
              disabled={isLoading || isError}
            />
          </label>
          {isSearchInputFocused && (
            <p
              className={cn(
                'text-muted-foreground mt-1 text-right text-[11px]',
                isSearchLimitFeedback && 'text-destructive'
              )}
            >
              {keyword.length}/{SEARCH_MAX_LENGTH}자
            </p>
          )}
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
              onClick={() => void refetch()}
              leftIcon={<RefreshCcwIcon className="size-4" />}
            >
              다시 시도
            </Button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="px-4 py-6">
            <EmptyState
              title={
                keyword.trim() ? '검색 결과가 없습니다.' : '채팅방이 없습니다'
              }
              description={
                keyword.trim()
                  ? '이름을 다시 검색해보세요.'
                  : '새 대화를 시작하면 채팅방이 생성됩니다.'
              }
            />
          </div>
        ) : (
          <div className="px-2 py-2 pb-8">
            {filteredRooms.map((room) => (
              <ChatRoomListItem
                key={room.id}
                room={room}
                onPress={(roomId) => router.push(`/chat/${roomId}`)}
              />
            ))}
            {hasNextPage && (
              <div ref={ref} className="h-4 w-full" aria-hidden>
                {isFetchingNextPage && (
                  <div className="text-muted-foreground py-4 text-center text-sm">
                    채팅방을 불러오고 있어요...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { ChatRoomListPage }
