/** API 응답의 사용자 정보 */
export interface UserInfo {
  id: number
  name: string
  email: string
  phone_number: string
  lined_number: string
  company: string
  department: string
  position: string
  profile_image_url: string
  description: string
}

/** API 응답 래퍼 */
export interface UserInfoResponse {
  code: {
    error: boolean
    is5xxServerError: boolean
    is4xxClientError: boolean
    is1xxInformational: boolean
    is2xxSuccessful: boolean
    is3xxRedirection: boolean
  }
  message: string
  data: UserInfo
}
