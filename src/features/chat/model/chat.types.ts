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

export interface ChatSocketMessageEvent {
  room_id: number
  message_id?: string
  sender_user_id: number
  sender_name?: string
  content: string
  created_at: string
}

export interface ChatRoomNotificationEvent {
  room_id: number
  unread_count: number
  latest_message: string
  latest_message_created_at: string
  other_user_id?: number
  other_user_name?: string
  other_user_profile_image_url?: string
}

export interface WsTicketData {
  ticket: string
}

export interface IssueWsTicketResponse {
  message: string
  data: WsTicketData
}

export interface SendChatMessagePayload {
  room_id: number
  content: string
}

export interface ChatReadReceiptEvent {
  room_id: number
  last_read_message_id: string
}
