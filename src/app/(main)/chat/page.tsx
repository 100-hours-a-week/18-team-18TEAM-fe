import { Suspense } from 'react'
import { ChatRoomListPage } from '@/features/chat'

export default function ChatListRoutePage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <ChatRoomListPage />
    </Suspense>
  )
}
