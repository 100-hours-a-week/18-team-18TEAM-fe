import { apiClient } from '@/shared/api'
import type {
  InvitationCardResponse,
  SaveCardRequest,
  SaveCardResponse,
} from '../model'

/** UUID로 명함 조회 */
export async function getCardByUuid(
  uuid: string
): Promise<InvitationCardResponse> {
  const response = await apiClient.get<InvitationCardResponse>(
    `/cards/uuid/${uuid}`
  )
  return response.data
}

/** 명함을 지갑에 저장 */
export async function saveCardToWallet(
  data: SaveCardRequest
): Promise<SaveCardResponse> {
  const response = await apiClient.post<SaveCardResponse>('/wallets', data)
  return response.data
}
