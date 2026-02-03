import './globals.css'
import { KakaoScript } from '@/shared/kakao-script'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-100">
        <Providers>
          <div className="mx-auto min-h-screen max-w-[430px] bg-white shadow-lg">
            <main className="min-h-dvh w-full">{children}</main>
          </div>
        </Providers>
        <KakaoScript />
      </body>
    </html>
  )
}
