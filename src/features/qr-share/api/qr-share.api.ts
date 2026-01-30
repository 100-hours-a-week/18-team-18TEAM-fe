import { apiClient } from '@/shared/api'
import type { MyLatestCardResponse } from '../model'

/** 내 최신 명함 조회 */
export async function getMyLatestCard(): Promise<MyLatestCardResponse> {
  const response = await apiClient.get<MyLatestCardResponse>('/cards/me/latest')
  return response.data
}
