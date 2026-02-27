import { ChatRealtimeProvider } from '@/features/chat'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ChatRealtimeProvider>{children}</ChatRealtimeProvider>
}
