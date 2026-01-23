/**
 * 공통 프로필 데이터 타입
 */
export interface ProfileData {
  name: string
  department?: string
  position?: string
  company?: string
  phone?: string
  email?: string
  tel?: string
  avatarSrc?: string | null
}
