import { Suspense } from 'react'
import { ChatRoomPage } from '@/features/chat'

interface ChatRoomRoutePageProps {
  params: Promise<{ roomId: string }>
}

export default async function ChatRoomRoutePage({
  params,
}: ChatRoomRoutePageProps) {
  const { roomId } = await params
  return (
    <Suspense fallback={<div className="bg-background min-h-screen" />}>
      <ChatRoomPage roomId={roomId} />
    </Suspense>
  )
}
