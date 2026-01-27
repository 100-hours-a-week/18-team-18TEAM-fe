import { apiClient } from '@/shared/api'
import type { ProfileFormData } from '../model'

/** 프로필 업데이트 요청 타입 */
interface UpdateProfileRequest {
  name?: string
  email: string
  phone_number: string
  lined_number?: string
  company?: string
  department?: string
  position?: string
  profile_image_url?: string
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

/** ProfileFormData를 API 요청 형태로 변환 */
function toUpdateRequest(data: ProfileFormData): UpdateProfileRequest {
  return {
    name: data.name || undefined,
    email: data.email,
    phone_number: data.phone,
    lined_number: data.tel || undefined,
    company: data.company || undefined,
    department: data.department || undefined,
    position: data.position || undefined,
    profile_image_url: data.profileImage || undefined,
  }
}

/** 프로필 수정 API */
export async function updateProfile(
  data: ProfileFormData
): Promise<UpdateProfileResponse> {
  const response = await apiClient.put<UpdateProfileResponse>(
    '/users/me',
    toUpdateRequest(data)
  )
  return response.data
}
