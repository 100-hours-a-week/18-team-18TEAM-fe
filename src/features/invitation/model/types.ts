/**
 * 초대(링크 공유) 관련 타입 정의
 */

/** UUID 기반 명함 조회 응답 데이터 */
export interface InvitationCardData {
  id: number
  uuid: string
  name: string
  email: string
  phone_number: string
  lined_number: string
  company: string
  department: string
  position: string
  start_date: string
  end_date: string
  is_progress: string
  ai_card_image_url: string
}

/** GET /cards/uuid/{uuid} 응답 */
export interface InvitationCardResponse {
  message: string
  data: InvitationCardData
}

/** 명함 저장 요청 */
export interface SaveCardRequest {
  uuid: string
}

/** 명함 저장 응답 */
export interface SaveCardResponse {
  message: string
}
