/**
 * QR 스캔 관련 타입 정의
 */

/** 명함 저장 요청 */
export interface SaveCardRequest {
  uuid: string
}

/** 명함 저장 응답 */
export interface SaveCardResponse {
  message: string
  data: ScannedCardData
}

/** 스캔된 명함 데이터 */
export interface ScannedCardData {
  name: string
  email: string
  phone_number: string
  lined_number: string
  company: string
  department: string
  position: string
  profile_image_url: string
  qr_image_url: string
  description: string
  ai_card_image_url: string
}

/** QR 스캔 상태 */
export type QrScanStatus =
  | 'idle'
  | 'requesting'
  | 'scanning'
  | 'success'
  | 'failure'
  | 'permission-denied'
