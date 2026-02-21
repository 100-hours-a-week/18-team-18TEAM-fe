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

export async function createChatRoom(
  body: CreateChatRoomRequest
): Promise<CreateChatRoomResponse> {
  const response = await apiClient.post<CreateChatRoomResponse>(
    '/chat/rooms',
    body
  )
  return response.data
}
