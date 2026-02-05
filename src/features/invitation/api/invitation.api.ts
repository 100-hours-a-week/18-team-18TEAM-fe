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
  const response = await apiClient.post<SaveCardResponse>('/wallets', data, {
    skipAuthHandling: true, // 401 시 글로벌 refresh/redirect 우회 → 호출측에서 모달 처리
  })
  return response.data
}
