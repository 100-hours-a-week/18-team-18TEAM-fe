import { ServerFetchError, serverFetch } from '@/server/bff/server-fetch'
import type {
  GetWalletsResponse,
  GetWalletsParams,
} from '../model/wallet.types'

export async function getWalletsServer(
  params: GetWalletsParams = {}
): Promise<GetWalletsResponse> {
  const { size = 5, cursorId, keyword } = params

  const searchParams = new URLSearchParams()
  searchParams.set('size', String(size))
  if (cursorId) searchParams.set('cursorId', String(cursorId))
  if (keyword) searchParams.set('keyword', keyword)

  const search = `?${searchParams.toString()}`
  try {
    const response = await serverFetch('/wallets', search)

    if (!response.ok) {
      throw new ServerFetchError(
        response.status,
        `Failed to fetch wallets: ${response.status}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ServerFetchError) {
      throw error
    }

    throw new ServerFetchError(500, 'Failed to fetch wallets')
  }
}
