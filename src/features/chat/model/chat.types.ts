export interface ChatParticipant {
  id: number
  name: string
  avatarUrl?: string | null
  company?: string
  position?: string
  isOnline?: boolean
}

export interface ChatRoomSummary {
  id: string
  participant: ChatParticipant
  lastMessagePreview: string
  lastMessageAt: string
  unreadCount: number
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: number
  senderName: string
  content: string
  sentAt: string
  direction: 'sent' | 'received'
  isRead: boolean
}

export interface ChatRoomState {
  room: ChatRoomSummary
  messages: ChatMessage[]
}
