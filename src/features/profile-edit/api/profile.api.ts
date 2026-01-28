import { apiClient } from '@/shared/api'
import type { ProfileFormData } from '../model'

/** 프로필 업데이트 요청 타입 */
interface UpdateProfileRequest {
  name?: string | null
  email: string
  phone_number: string
  lined_number?: string | null
  company?: string | null
  department?: string | null
  position?: string | null
  profile_image_url?: string | null
}

/** API 응답 타입 */
interface UpdateProfileResponse {
  code: {
    error: boolean
    is5xxServerError: boolean
    is4xxClientError: boolean
    is1xxInformational: boolean
    is2xxSuccessful: boolean
    is3xxRedirection: boolean
  }
  message: string
  data: null
}

// 빈 문자열/공백만 있는 문자열은 null로 변환해 PATCH 시 비우기 반영
function emptyToNull(value?: string | null) {
  if (value === undefined || value === null) return undefined
  return value.trim() === '' ? null : value
}

/** ProfileFormData를 API 요청 형태로 변환 */
function toUpdateRequest(data: ProfileFormData): UpdateProfileRequest {
  return {
    name: emptyToNull(data.name),
    email: data.email,
    phone_number: data.phone,
    lined_number: emptyToNull(data.tel),
    company: emptyToNull(data.company),
    department: emptyToNull(data.department),
    position: emptyToNull(data.position),
    profile_image_url: emptyToNull(data.profileImage),
  }
}

/** 프로필 수정 API */
export async function updateProfile(
  data: ProfileFormData
): Promise<UpdateProfileResponse> {
  const response = await apiClient.patch<UpdateProfileResponse>(
    '/users/me',
    toUpdateRequest(data)
  )
  return response.data
}
