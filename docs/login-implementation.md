# 로그인 페이지 구현 설명서

## 목차

1. [전체 구조](#전체-구조)
2. [Shared API Layer](#shared-api-layer)
3. [Shared Lib Layer](#shared-lib-layer)
4. [Auth Feature](#auth-feature)
5. [Pages](#pages)
6. [Middleware](#middleware)
7. [로그인 플로우](#로그인-플로우)

---

## 전체 구조

```
src/
├── shared/
│   ├── api/
│   │   ├── axios.ts          # axios 인스턴스
│   │   └── index.ts
│   └── lib/
│       ├── cookies.ts        # 쿠키 유틸리티
│       └── index.ts
├── features/
│   └── auth/
│       ├── api/
│       │   ├── auth.api.ts   # 인증 API 함수
│       │   └── index.ts
│       ├── model/
│       │   ├── auth.atom.ts  # Jotai 상태
│       │   ├── auth.types.ts # 타입 정의
│       │   └── index.ts
│       └── ui/
│           ├── login-form.tsx
│           ├── login-error-state.tsx
│           ├── terms-dialog.tsx
│           ├── privacy-dialog.tsx
│           └── index.ts
├── app/
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx      # /login 라우트
│       └── kakao/
│           └── callback/
│               └── page.tsx  # /kakao/callback 라우트
└── middleware.ts             # 인증 미들웨어
```

---

## Shared API Layer

### `src/shared/api/axios.ts`

```ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken } from '@/shared/lib/cookies'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**설명:**

- `axios.create()`: 커스텀 설정이 적용된 axios 인스턴스 생성
- `baseURL`: 모든 요청에 자동으로 붙는 기본 URL (환경변수에서 가져옴)
- `headers`: 모든 요청에 기본으로 포함될 헤더

```ts
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)
```

**설명:**

- `interceptors.request.use()`: 모든 요청이 전송되기 전에 실행되는 함수
- 쿠키에서 accessToken을 가져와 `Authorization` 헤더에 자동 첨부
- `Bearer` 토큰 방식: JWT 인증의 표준 형식

```ts
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // TODO: 401 에러 시 토큰 갱신 로직 추가
    return Promise.reject(error)
  }
)
```

**설명:**

- `interceptors.response.use()`: 응답을 받은 후 실행되는 함수
- 첫 번째 함수: 성공 응답 처리
- 두 번째 함수: 에러 응답 처리 (401 에러 시 토큰 갱신 등)

---

## Shared Lib Layer

### `src/shared/lib/cookies.ts`

```ts
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}
```

**설명:**

- 쿠키 키 이름을 상수로 정의하여 오타 방지
- `isBrowser()`: Next.js는 서버/클라이언트 양쪽에서 실행되므로, 브라우저 환경인지 확인 필요

```ts
export function setTokenCookies(
  accessToken: string,
  refreshToken: string
): void {
  if (!isBrowser()) return

  const options = 'path=/; secure; samesite=lax'

  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; ${options}`
  document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; ${options}`
}
```

**설명:**

- `path=/`: 모든 경로에서 쿠키 접근 가능
- `secure`: HTTPS에서만 전송 (보안)
- `samesite=lax`: CSRF 공격 방지

```ts
export function getAccessToken(): string | null {
  if (!isBrowser()) return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === ACCESS_TOKEN_KEY) {
      return value
    }
  }
  return null
}
```

**설명:**

- `document.cookie`는 `"key1=value1; key2=value2"` 형태의 문자열
- `;`로 분리 후 원하는 키의 값을 찾아 반환

```ts
export function removeTokenCookies(): void {
  if (!isBrowser()) return

  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
```

**설명:**

- 쿠키 삭제는 만료 시간을 과거로 설정하여 수행
- 로그아웃 시 사용

---

## Auth Feature

### `src/features/auth/model/auth.types.ts`

```ts
export interface User {
  id: number
  name: string
  email: string
  profileImage?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
```

**설명:**

- `User`: 로그인한 사용자 정보 타입
- `LoginResponse`: 로그인 API 응답 타입
- `?`: 선택적 속성 (없을 수도 있음)

### `src/features/auth/model/auth.atom.ts`

```ts
import { atom } from 'jotai'
import type { User } from './auth.types'

export const userAtom = atom<User | null>(null)

export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null)

export const authLoadingAtom = atom<boolean>(false)
```

**설명:**

- **Jotai**: React 상태 관리 라이브러리 (Redux보다 간단)
- `atom()`: 전역 상태 단위 생성
- `userAtom`: 현재 로그인한 사용자 정보 (null이면 비로그인)
- `isAuthenticatedAtom`: 파생 상태 - userAtom이 null이 아니면 true
- `authLoadingAtom`: 로그인 처리 중 로딩 상태

**Jotai 사용법:**

```tsx
// 읽기
const user = useAtomValue(userAtom)

// 쓰기
const setUser = useSetAtom(userAtom)
setUser({ id: 1, name: '홍길동', email: 'hong@example.com' })

// 읽기 + 쓰기
const [user, setUser] = useAtom(userAtom)
```

### `src/features/auth/api/auth.api.ts`

```ts
export function getKakaoAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

  return `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
}
```

**설명:**

- 카카오 OAuth 인증 URL 생성
- `client_id`: 카카오 개발자 콘솔에서 발급받은 REST API 키
- `redirect_uri`: 인증 후 돌아올 URL (콜백 페이지)
- `response_type=code`: 인가 코드 방식 사용

```ts
export async function postKakaoLogin(code: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/login/kakao', { code })
  return response.data
}
```

**설명:**

- 카카오에서 받은 인가 코드를 백엔드로 전송
- 백엔드가 이 코드로 카카오 서버와 통신하여 사용자 정보 획득
- 백엔드가 자체 JWT 토큰 발급하여 반환

---

## Pages

### `src/app/(auth)/login/page.tsx`

```tsx
'use client'
```

**설명:**

- Next.js 13+ App Router에서 클라이언트 컴포넌트 선언
- `useState`, `useEffect`, 이벤트 핸들러 등 사용 시 필수

```tsx
const [termsOpen, setTermsOpen] = React.useState(false)
const [privacyOpen, setPrivacyOpen] = React.useState(false)
```

**설명:**

- 이용약관/개인정보처리방침 다이얼로그의 열림 상태 관리

```tsx
const handleKakaoLogin = () => {
  window.location.href = getKakaoAuthUrl()
}
```

**설명:**

- 카카오 로그인 버튼 클릭 시 카카오 인증 페이지로 이동
- `window.location.href`: 페이지 전체 이동 (SPA 라우팅 X)

```tsx
<Image
  src="/icons/kakao_login_medium_wide.png"
  alt="카카오 로그인"
  width={300}
  height={45}
  className="w-full"
  priority
/>
```

**설명:**

- `next/image`: 이미지 최적화 컴포넌트
- `priority`: LCP(Largest Contentful Paint) 이미지로 우선 로딩

### `src/app/(auth)/kakao/callback/page.tsx`

```tsx
function KakaoCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // ...
}
```

**설명:**

- `useRouter()`: 프로그래매틱 네비게이션용 (router.push, router.replace 등)
- `useSearchParams()`: URL 쿼리 파라미터 접근 (?code=xxx)

```tsx
export default function KakaoCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <React.Suspense fallback={/* 로딩 UI */}>
        <KakaoCallbackContent />
      </React.Suspense>
    </div>
  )
}
```

**설명:**

- `Suspense`: Next.js 15에서 `useSearchParams()`는 Suspense 경계 필수
- 서버 사이드 렌더링 시 URL 파라미터를 알 수 없어 대기 필요
- `fallback`: 로딩 중 표시할 UI

```tsx
React.useEffect(() => {
  const code = searchParams.get('code')

  if (!code) {
    setError('인가 코드가 없습니다.')
    return
  }

  const handleLogin = async () => {
    setAuthLoading(true)
    try {
      const response = await postKakaoLogin(code)
      setTokenCookies(response.accessToken, response.refreshToken)
      setUser(response.user)
      router.replace('/home')
    } catch {
      setError('로그인에 실패했습니다.')
    } finally {
      setAuthLoading(false)
    }
  }

  handleLogin()
}, [searchParams, router, setUser, setAuthLoading])
```

**설명:**

- 컴포넌트 마운트 시 자동으로 로그인 처리
- `router.replace()`: 히스토리에 남기지 않고 이동 (뒤로가기 시 콜백 페이지로 안 돌아감)

---

## Middleware

### `src/middleware.ts`

```ts
const PUBLIC_ROUTES = ['/login', '/kakao/callback']
```

**설명:**

- 인증 없이 접근 가능한 공개 라우트 목록

```ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // 인증이 필요한 페이지에 토큰 없이 접근
  if (!isPublicRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 이미 로그인된 상태에서 로그인 페이지 접근
  if (pathname === '/login' && accessToken) {
    const homeUrl = new URL('/home', request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}
```

**설명:**

- 미들웨어: 모든 요청에 대해 페이지 렌더링 전에 실행
- 서버에서 실행되므로 `request.cookies`로 쿠키 접근
- 인증 상태에 따라 적절한 페이지로 리다이렉트

```ts
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons).*)'],
}
```

**설명:**

- `matcher`: 미들웨어가 실행될 경로 패턴
- `(?!...)`: 부정 lookahead - 해당 패턴 제외
- API, 정적 파일, 이미지, 아이콘 등은 미들웨어 실행 제외

---

## 로그인 플로우

```
1. 사용자가 /login 페이지 접속
   ↓
2. 카카오 로그인 버튼 클릭
   ↓
3. 카카오 인증 페이지로 이동 (getKakaoAuthUrl)
   ↓
4. 사용자가 카카오 계정으로 로그인
   ↓
5. 카카오가 /kakao/callback?code=xxx 로 리다이렉트
   ↓
6. 콜백 페이지에서 code 추출
   ↓
7. postKakaoLogin(code) 호출 → 백엔드로 code 전송
   ↓
8. 백엔드가 카카오 서버와 통신하여 사용자 정보 획득
   ↓
9. 백엔드가 JWT 토큰 발급하여 응답
   ↓
10. 프론트엔드가 토큰을 쿠키에 저장 (setTokenCookies)
    ↓
11. Jotai 상태에 사용자 정보 저장 (setUser)
    ↓
12. /home 으로 이동
```

---

## 환경변수

### `.env.local`

```
NEXT_PUBLIC_API_URL=https://dev.cardcaro.com/api
NEXT_PUBLIC_KAKAO_CLIENT_ID=<카카오 REST API Key>
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/kakao/callback
```

**설명:**

- `NEXT_PUBLIC_` 접두사: 클라이언트에서도 접근 가능 (브라우저에 노출됨)
- 접두사 없으면 서버에서만 접근 가능 (보안 정보에 사용)

---

## FSD 아키텍처 참고

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

```
src/
├── app/          # 라우트 (Next.js App Router)
├── features/     # 기능별 모듈 (auth, home, settings 등)
│   └── [feature]/
│       ├── api/    # API 함수
│       ├── model/  # 상태 관리 (Jotai atoms)
│       └── ui/     # UI 컴포넌트
├── shared/       # 공유 모듈
│   ├── api/      # API 클라이언트
│   ├── lib/      # 유틸리티 함수
│   └── ui/       # 공통 UI 컴포넌트
└── middleware.ts
```

**계층 규칙:**

- `shared` → 모든 곳에서 import 가능
- `features` → `shared`만 import 가능, 다른 feature import 불가
- `app` → `features`, `shared` import 가능
