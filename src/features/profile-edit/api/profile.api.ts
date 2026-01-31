import { apiClient } from '@/shared/api'
import type { ProfileFormData } from '../model'

/** Presigned URL 요청 타입 */
interface GetPresignedUrlRequest {
  category: 'PROFILE' | 'CARD'
  originName: string
}

/** Presigned URL 응답 타입 (백엔드가 래퍼 없이 바로 내려줌) */
interface GetPresignedUrlResponse {
  url: string
  key: string
  expiresInSeconds: number
}

/**
 * S3 presigned URL을 발급받습니다.
 */
export async function getPresignedUrl(
  originName: string
): Promise<{ url: string; key: string }> {
  const response = await apiClient.post<GetPresignedUrlResponse>(
    '/s3/presigned-urls',
    {
      category: 'PROFILE',
      originName,
    } satisfies GetPresignedUrlRequest
  )

  const { url, key } = response.data
  return { url, key }
}

/**
 * Presigned URL을 사용하여 S3에 파일을 업로드합니다.
 */
export async function uploadToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })
}

/** 프로필 업데이트 요청 타입 */
interface UpdateProfileRequest {
  name?: string | null
  email: string
  phone_number: string
  lined_number?: string | null
  company?: string | null
  department?: string | null
  position?: string | null
  profile_image_key?: string | null
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
    profile_image_key: emptyToNull(data.profileImageKey),
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
