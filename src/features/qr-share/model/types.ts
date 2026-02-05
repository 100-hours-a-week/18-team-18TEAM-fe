/**
 * QR 공유 관련 타입 정의
 */

/** 내 최신 명함 API 응답 */
export interface MyLatestCardResponse {
  message: string
  data: CardData
}

/** 명함 데이터 */
export interface CardData {
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
  description: string
}
