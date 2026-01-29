import { apiClient } from '@/shared/api'
import type { SaveCardRequest, SaveCardResponse } from '../model'

/** QR 스캔으로 명함 저장 */
export async function saveScannedCard(
  data: SaveCardRequest
): Promise<SaveCardResponse> {
  const response = await apiClient.post<SaveCardResponse>('/wallets', data)
  return response.data
}
