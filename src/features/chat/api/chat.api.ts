import { apiClient } from '@/shared/api'

export interface CreateChatRoomRequest {
  target_user_id: number
}

export interface ChatRoomSummaryData {
  room_id: number
  other_user_id: number
  other_user_name: string
  other_user_profile_image_url: string
  latest_message_content: string
  latest_message_created_at: string
  unread_count: number
}

export interface CreateChatRoomResponse {
  message: string
  data: ChatRoomSummaryData
}

export interface CursorPagination {
  cursorId?: number
  has_next?: boolean
}

export interface GetChatRoomsParams {
  cursorId?: number
  size?: number
}

export interface GetChatRoomsResponse {
  message: string
  data: ChatRoomSummaryData[]
  pagination: CursorPagination
}

export interface ChatMessageData {
  message_id: number
  room_id: number
  sender_user_id: number
  sender_name: string
  content: string
  created_at: string
}

export interface GetChatRoomMessagesParams {
  cursorId?: number
  size?: number
}

export interface GetChatRoomMessagesResponse {
  message: string
  data: ChatMessageData[]
  pagination: CursorPagination
}

const DEFAULT_CHAT_PAGE_SIZE = 20

function toCursorParams(params: { cursorId?: number; size?: number }): {
  cursorId?: number
  size: number
} {
  return {
    ...(params.cursorId !== undefined ? { cursorId: params.cursorId } : {}),
    size: params.size ?? DEFAULT_CHAT_PAGE_SIZE,
  }
}

export async function createChatRoom(
  body: CreateChatRoomRequest
): Promise<CreateChatRoomResponse> {
  const response = await apiClient.post<CreateChatRoomResponse>(
    '/chat/rooms',
    body
  )
  return response.data
}

export async function getChatRooms(
  params: GetChatRoomsParams = {}
): Promise<GetChatRoomsResponse> {
  const response = await apiClient.get<GetChatRoomsResponse>('/chat/rooms', {
    params: toCursorParams(params),
  })
  return response.data
}

export async function getChatRoomMessages(
  roomId: string | number,
  params: GetChatRoomMessagesParams = {}
): Promise<GetChatRoomMessagesResponse> {
  const response = await apiClient.get<GetChatRoomMessagesResponse>(
    `/chat/rooms/${roomId}/messages`,
    {
      params: toCursorParams(params),
    }
  )
  return response.data
}
