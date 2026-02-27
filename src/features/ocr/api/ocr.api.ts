import { apiClient } from '@/shared/api'
import type {
  OcrJobResult,
  OcrPollBffResponse,
  OcrStartRequest,
  OcrStartResponse,
  OcrSubmitRequest,
} from '../model'

const POLL_INTERVAL_MS = 2000
const POLL_MAX_ATTEMPTS = 90
const S3_BASE_URL = 'https://bizkit-img.s3.ap-northeast-2.amazonaws.com'

interface GetPresignedUrlRequest {
  category: 'OCR'
  originName: string
}

interface GetPresignedUrlResponse {
  url: string
  key: string
  expiresInSeconds: number
}

async function base64ToFile(base64: string, fileName: string): Promise<File> {
  const res = await fetch(base64)
  const blob = await res.blob()
  return new File([blob], fileName, { type: blob.type })
}

async function getPresignedUrl(
  originName: string
): Promise<{ url: string; key: string }> {
  const response = await apiClient.post<GetPresignedUrlResponse>(
    '/s3/presigned-urls',
    { category: 'OCR', originName } satisfies GetPresignedUrlRequest
  )
  const { url, key } = response.data
  return { url, key }
}

async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  if (!res.ok) {
    throw new Error('S3 업로드에 실패했습니다.')
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function mapBffResultToOcrJobResult(
  bffResponse: OcrPollBffResponse
): OcrJobResult {
  const ai = bffResponse.result
  return {
    task_id: bffResponse.task_id,
    mode: bffResponse.mode,
    capturedImageUrl: null,
    name: ai?.name ?? '',
    email: ai?.email ?? '',
    company: ai?.company ?? '',
    phone_number: ai?.mobile_phone ?? '',
    lined_number: ai?.company_phone ?? '',
    position: ai?.job_title ?? '',
    department: ai?.department ?? '',
    is_progress: false,
    start_date: '',
    end_date: '',
  }
}

export async function startOcrJob(
  request: OcrStartRequest
): Promise<OcrStartResponse> {
  const file = await base64ToFile(request.capturedImageUrl, 'business-card.jpg')

  const { url: presignedUrl, key } = await getPresignedUrl(file.name)
  await uploadToS3(presignedUrl, file)

  const publicUrl = `${S3_BASE_URL}/${key}`

  const response = await apiClient.post<OcrStartResponse>('/ai/ocr/start', {
    image_url: publicUrl,
    mode: request.mode,
  })

  return { task_id: response.data.task_id }
}

export async function getOcrJobResult(task_id: string): Promise<OcrJobResult> {
  for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
    const pollResponse = await apiClient.get<OcrPollBffResponse>(
      `/ai/ocr/${task_id}`
    )
    const { status, error, result } = pollResponse.data

    if (status === 'failed' || error) {
      throw new Error(error ?? 'OCR 처리에 실패했습니다.')
    }

    if (status === 'completed') {
      if (result && !result.is_business_card) {
        throw new Error('명함이 인식되지 않았습니다.')
      }

      return mapBffResultToOcrJobResult(pollResponse.data)
    }

    await wait(POLL_INTERVAL_MS)
  }

  throw new Error('OCR 처리 시간이 초과되었습니다.')
}

export async function submitOcrResult(
  _task_id: string,
  _data: OcrSubmitRequest
): Promise<void> {
  // TODO: 실제 엔드포인트 연결 예정
}
