export interface WalletCard {
  id: number
  uuid: string
  user_id: number
  name: string
  email: string
  phone_number: string
  lined_number: string
  company: string
  position: string
  department: string
  start_date: string
  end_date: string
  is_progress: boolean
  ai_image_key: string
}

export interface GetWalletsResponse {
  message: string
  data: WalletCard[]
  pagination: {
    has_next?: boolean
    cursorId?: number
  }
}

export interface GetWalletsParams {
  size?: number
  cursorId?: number
  keyword?: string
}
