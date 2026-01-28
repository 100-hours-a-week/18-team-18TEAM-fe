import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 브라우저 쿠키에서 accessToken 값을 읽어 Authorization 헤더로 추가
apiClient.interceptors.request.use(
  (config) => {
    if (typeof document === 'undefined') {
      return config
    }

    const rawTokenCookie = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('accessToken='))

    const accessToken = rawTokenCookie
      ? decodeURIComponent(rawTokenCookie.split('=')[1] ?? '')
      : null

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
