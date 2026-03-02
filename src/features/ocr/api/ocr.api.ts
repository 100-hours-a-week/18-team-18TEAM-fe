import { apiClient } from '@/shared/api'
import type {
  OcrJobResult,
  OcrMode,
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

interface SelfCareerRequest {
  name?: string | null
  email: string
  phone_number: string
  lined_number?: string | null
  company?: string | null
  position?: string | null
  department?: string | null
  start_date: string
  end_date?: string | null
  is_progress: boolean
  ai_image_key?: string | null
}

interface PaperCardCreateRequest {
  name: string
  email: string
  company: string
  position?: string
  department?: string
  phone_number?: string
  lined_number?: string
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

function emptyToNull(value?: string | null): string | null | undefined {
  if (value === undefined || value === null) return undefined
  return value.trim() === '' ? null : value
}

function emptyToUndefined(value?: string | null): string | undefined {
  if (value === undefined || value === null) return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

function toSelfCareerRequest(data: OcrSubmitRequest): SelfCareerRequest {
  return {
    name: emptyToNull(data.name),
    email: data.email.trim(),
    phone_number: data.phone_number.trim(),
    lined_number: emptyToNull(data.lined_number),
    company: emptyToNull(data.company),
    department: emptyToNull(data.department),
    position: emptyToNull(data.position),
    start_date: data.start_date,
    end_date: data.is_progress ? null : emptyToNull(data.end_date),
    is_progress: data.is_progress,
    ai_image_key: null,
  }
}

function toPaperCardRequest(data: OcrSubmitRequest): PaperCardCreateRequest {
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company.trim(),
    position: emptyToUndefined(data.position),
    department: emptyToUndefined(data.department),
    phone_number: emptyToUndefined(data.phone_number),
    lined_number: emptyToUndefined(data.lined_number),
  }
}

function mapBffResultToOcrJobResult(
  bffResponse: OcrPollBffResponse
): OcrJobResult {
  const ai = bffResponse.result
  return {
    task_id: bffResponse.task_id,
    mode: bffResponse.mode,
    capturedImageUrl: bffResponse.image_url ?? null,
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

  return {
    task_id: response.data.task_id,
    status: response.data.status,
  }
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
  mode: OcrMode,
  data: OcrSubmitRequest
): Promise<void> {
  if (mode === 'SELF') {
    await apiClient.post('/cards/me', toSelfCareerRequest(data))
    return
  }

  await apiClient.post('/wallets/paper-cards', toPaperCardRequest(data))
}
