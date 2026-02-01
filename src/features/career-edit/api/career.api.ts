import { apiClient } from '@/shared/api'
import type { CareerFormData } from '../model'

/** 경력(Card) 단일 조회 응답 타입 */
export interface CareerResponse {
  id: number
  name: string | null
  email: string
  phone_number: string
  lined_number: string | null
  company: string | null
  position: string | null
  department: string | null
  start_date: string
  end_date: string | null
  is_progress: boolean
  ai_image_key: string | null
  ai_image_url: string | null
  created_at: string
  updated_at: string
}

/** 경력(Card) 목록 조회 응답 타입 */
export interface CareersResponse {
  code: {
    error: boolean
    is5xxServerError: boolean
    is4xxClientError: boolean
    is1xxInformational: boolean
    is2xxSuccessful: boolean
    is3xxRedirection: boolean
  }
  message: string
  data: CareerResponse[]
}

/** 단일 조회 API 응답 타입 */
interface SingleCareerApiResponse {
  code: {
    error: boolean
    is5xxServerError: boolean
    is4xxClientError: boolean
    is1xxInformational: boolean
    is2xxSuccessful: boolean
    is3xxRedirection: boolean
  }
  message: string
  data: CareerResponse
}

/** 경력 생성/수정 요청 타입 */
interface CareerRequest {
  name?: string | null
  email: string
  phone_number: string
  lined_number?: string | null
  company?: string | null
  position?: string | null
  department?: string | null
  start_date: string
  end_date?: string | null
  is_progress: boolean
  ai_image_key?: string | null
}

// 빈 문자열/공백만 있는 문자열은 null로 변환
function emptyToNull(value?: string | null) {
  if (value === undefined || value === null) return undefined
  return value.trim() === '' ? null : value
}

/** CareerFormData를 API 요청 형태로 변환 */
function toCareerRequest(data: CareerFormData): CareerRequest {
  return {
    name: emptyToNull(data.name),
    email: data.email,
    phone_number: data.phone_number,
    lined_number: emptyToNull(data.lined_number),
    company: emptyToNull(data.company),
    department: emptyToNull(data.department),
    position: emptyToNull(data.position),
    start_date: data.start_date,
    end_date: data.is_progress ? null : emptyToNull(data.end_date),
    is_progress: data.is_progress,
    ai_image_key: emptyToNull(data.ai_image_key),
  }
}

/** 내 경력 전체 조회 */
export async function getCareers(): Promise<CareersResponse> {
  const response = await apiClient.get<CareersResponse>('/cards/me')
  return response.data
}

/** 특정 유저의 경력 전체 조회 */
export async function getCareersByUserId(
  userId: string
): Promise<CareersResponse> {
  const response = await apiClient.get<CareersResponse>('/cards', {
    params: { userId },
  })
  return response.data
}

/** 경력 단일 조회 */
export async function getCareer(cardId: string): Promise<CareerResponse> {
  const response = await apiClient.get<SingleCareerApiResponse>(
    `/cards/${cardId}`
  )
  return response.data.data
}

/** 경력 생성 */
export async function createCareer(data: CareerFormData): Promise<void> {
  await apiClient.post('/cards/me', toCareerRequest(data))
}

/** 경력 수정 */
export async function updateCareer(
  cardId: string,
  data: CareerFormData
): Promise<void> {
  await apiClient.patch(`/cards/${cardId}`, toCareerRequest(data))
}

/** 경력 삭제 */
export async function deleteCareer(cardId: string): Promise<void> {
  await apiClient.delete(`/cards/${cardId}`)
}
