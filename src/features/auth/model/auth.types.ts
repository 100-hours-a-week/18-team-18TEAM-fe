export interface User {
  id: number
  name: string
  email: string
  profileImage?: string
}

export interface LoginResponse {
  user: User
}
