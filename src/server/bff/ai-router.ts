import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { forwardToAi } from '@/server/bff/ai-client'
import { toProxyHeaders, type ForwardRequestBody } from '@/server/bff/spring-client'
import {
  createOcrJob,
  getOcrJob,
  updateOcrJob,
  type OcrMode,
  type OcrTaskAiResult,
  type OcrTaskStatus,
} from '@/server/ocr/job-store'

type JsonRecord = Record<string, unknown>

interface OcrStartBffResponse {
  task_id: string
  status: OcrTaskStatus
}

interface OcrPollBffResponse {
  task_id: string
  status: OcrTaskStatus
  mode: OcrMode
  image_url: string
  result: OcrTaskAiResult | null
  error: string | null
}

interface AiProxyRequestOptions {
  request: NextRequest
  apiPath: string
  search: string
  method: string
  body?: ForwardRequestBody
  sessionUserId?: number | string | null
}

function jsonError(status: number, message: string): NextResponse {
  return NextResponse.json({ message }, { status })
}

async function toProxyResponse(upstream: Response): Promise<NextResponse> {
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: toProxyHeaders(upstream.headers),
  })
}

export function isAiPath(apiPath: string): boolean {
  return apiPath === '/ai' || apiPath.startsWith('/ai/')
}

function toAiApiPath(apiPath: string): string {
  if (apiPath === '/ai') return '/'
  return apiPath.slice('/ai'.length) || '/'
}

function isOcrStartRoute(apiPath: string, method: string): boolean {
  return method === 'POST' && apiPath === '/ocr/start'
}

function extractOcrTaskId(apiPath: string, method: string): string | null {
  if (method !== 'GET') return null

  const matched = /^\/ocr\/([^/]+)$/.exec(apiPath)
  if (!matched?.[1] || matched[1] === 'start') return null

  return matched[1]
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as JsonRecord
}

function pickUnknown(
  candidates: Array<JsonRecord | null>,
  keys: string[]
): unknown {
  for (const candidate of candidates) {
    if (!candidate) continue

    for (const key of keys) {
      if (key in candidate) {
        return candidate[key]
      }
    }
  }

  return undefined
}

function pickNullableString(
  candidates: Array<JsonRecord | null>,
  keys: string[]
): string | null {
  const value = pickUnknown(candidates, keys)
  if (value == null) return null
  return typeof value === 'string' ? value : null
}

function toOcrTaskStatus(value: unknown): OcrTaskStatus {
  const normalized = typeof value === 'string' ? value.toLowerCase() : ''

  if (['completed', 'done', 'success', 'succeeded'].includes(normalized)) {
    return 'completed'
  }

  if (['failed', 'error', 'cancelled', 'canceled'].includes(normalized)) {
    return 'failed'
  }

  if (
    ['running', 'processing', 'in_progress', 'in-progress'].includes(normalized)
  ) {
    return 'running'
  }

  return 'pending'
}

function toOcrMode(value: unknown): OcrMode | null {
  if (typeof value !== 'string') return null

  const normalized = value.toUpperCase()
  if (normalized === 'SELF' || normalized === 'OTHER') {
    return normalized
  }

  return null
}

function toOcrTaskAiResult(payload: JsonRecord): OcrTaskAiResult {
  const nestedResult = asRecord(payload.result)
  const nestedData = asRecord(payload.data)
  const candidates = [nestedResult, nestedData, payload]

  const isBusinessCard = pickUnknown(candidates, [
    'is_business_card',
    'isBusinessCard',
  ])

  return {
    is_business_card:
      typeof isBusinessCard === 'boolean' ? isBusinessCard : true,
    name: pickNullableString(candidates, ['name']),
    email: pickNullableString(candidates, ['email']),
    company: pickNullableString(candidates, ['company']),
    job_title: pickNullableString(candidates, ['job_title', 'jobTitle']),
    department: pickNullableString(candidates, ['department']),
    company_phone: pickNullableString(candidates, [
      'company_phone',
      'companyPhone',
    ]),
    mobile_phone: pickNullableString(candidates, ['mobile_phone', 'mobilePhone']),
  }
}

async function parseJsonRecord(response: Response): Promise<JsonRecord | null> {
  try {
    const parsed = await response.json()
    return asRecord(parsed)
  } catch {
    return null
  }
}

function parseBodyJson(body: ForwardRequestBody | undefined): JsonRecord | null {
  if (typeof body !== 'string') return null

  try {
    const parsed = JSON.parse(body)
    return asRecord(parsed)
  } catch {
    return null
  }
}

function toPollResponse(record: {
  task_id: string
  status: OcrTaskStatus
  mode: OcrMode
  image_url: string
  result: OcrTaskAiResult | null
  error: string | null
}): OcrPollBffResponse {
  return {
    task_id: record.task_id,
    status: record.status,
    mode: record.mode,
    image_url: record.image_url,
    result: record.result,
    error: record.error,
  }
}

async function handleOcrStart(
  request: NextRequest,
  search: string,
  body: ForwardRequestBody | undefined,
  sessionUserId: number | string | null
): Promise<NextResponse> {
  const requestPayload = parseBodyJson(body)
  if (!requestPayload) {
    return jsonError(400, 'Invalid OCR start request body.')
  }

  const mode = toOcrMode(requestPayload.mode)
  const imageUrlValue =
    (typeof requestPayload.image_url === 'string' && requestPayload.image_url) ||
    (typeof requestPayload.imageUrl === 'string' && requestPayload.imageUrl) ||
    null

  if (!mode || !imageUrlValue) {
    return jsonError(400, 'mode and image_url are required.')
  }

  const upstreamPayload = JSON.stringify({
    ...requestPayload,
    mode,
    image_url: imageUrlValue,
  })

  const startUpstream = await forwardToAi({
    apiPath: '/ocr/analyze',
    search,
    method: 'POST',
    body: upstreamPayload,
    requestHeaders: request.headers,
  })

  if (!startUpstream.ok) {
    return toProxyResponse(startUpstream)
  }

  const startPayload = await parseJsonRecord(startUpstream)
  if (!startPayload) {
    return jsonError(502, 'Invalid AI OCR start response.')
  }

  const startData = asRecord(startPayload.data)
  const candidates = [startData, startPayload]
  const taskId = pickNullableString(candidates, ['task_id', 'taskId'])

  if (!taskId) {
    return jsonError(502, 'task_id is missing in AI OCR start response.')
  }

  const status = toOcrTaskStatus(pickUnknown(candidates, ['status']))
  const now = new Date().toISOString()

  await createOcrJob({
    task_id: taskId,
    mode,
    image_url: imageUrlValue,
    status,
    userId: sessionUserId ?? null,
    result: null,
    error: null,
    created_at: now,
    updated_at: now,
  })

  const response: OcrStartBffResponse = {
    task_id: taskId,
    status,
  }

  return NextResponse.json(response, { status: 200 })
}

async function handleOcrPoll(
  request: NextRequest,
  taskId: string
): Promise<NextResponse> {
  const job = await getOcrJob(taskId)
  if (!job) {
    return jsonError(404, 'OCR task not found.')
  }

  if (job.status === 'completed' || job.status === 'failed') {
    return NextResponse.json(toPollResponse(job), { status: 200 })
  }

  const encodedTaskId = encodeURIComponent(taskId)
  const statusUpstream = await forwardToAi({
    apiPath: `/tasks/${encodedTaskId}`,
    search: '',
    method: 'GET',
    requestHeaders: request.headers,
  })

  if (!statusUpstream.ok) {
    return toProxyResponse(statusUpstream)
  }

  const statusPayload = await parseJsonRecord(statusUpstream)
  if (!statusPayload) {
    return jsonError(502, 'Invalid AI task status response.')
  }

  const statusData = asRecord(statusPayload.data)
  const statusCandidates = [statusData, statusPayload]
  const status = toOcrTaskStatus(pickUnknown(statusCandidates, ['status']))
  const error = pickNullableString(statusCandidates, ['error', 'message'])

  if (status !== 'completed') {
    const nextError = status === 'failed' ? error ?? 'OCR 처리에 실패했습니다.' : null
    const updated =
      (await updateOcrJob(taskId, {
        status,
        error: nextError,
      })) ?? {
        ...job,
        status,
        error: nextError,
      }

    return NextResponse.json(toPollResponse(updated), { status: 200 })
  }

  const resultUpstream = await forwardToAi({
    apiPath: `/tasks/${encodedTaskId}/result`,
    search: '',
    method: 'GET',
    requestHeaders: request.headers,
  })

  if (!resultUpstream.ok) {
    return toProxyResponse(resultUpstream)
  }

  const resultPayload = await parseJsonRecord(resultUpstream)
  if (!resultPayload) {
    return jsonError(502, 'Invalid AI task result response.')
  }

  const result = toOcrTaskAiResult(resultPayload)
  const updated =
    (await updateOcrJob(taskId, {
      status: 'completed',
      result,
      error: null,
    })) ?? {
      ...job,
      status: 'completed' as const,
      result,
      error: null,
    }

  return NextResponse.json(toPollResponse(updated), { status: 200 })
}

export async function proxyAiRequest({
  request,
  apiPath,
  search,
  method,
  body,
  sessionUserId,
}: AiProxyRequestOptions): Promise<NextResponse> {
  const aiApiPath = toAiApiPath(apiPath)

  try {
    if (isOcrStartRoute(aiApiPath, method)) {
      return await handleOcrStart(request, search, body, sessionUserId ?? null)
    }

    const ocrTaskId = extractOcrTaskId(aiApiPath, method)
    if (ocrTaskId && aiApiPath.startsWith('/ocr/')) {
      return await handleOcrPoll(request, ocrTaskId)
    }

    const upstream = await forwardToAi({
      apiPath: aiApiPath,
      search,
      method,
      body,
      requestHeaders: request.headers,
    })
    return toProxyResponse(upstream)
  } catch (error) {
    console.error('AI proxy request failed:', error)
    return jsonError(500, 'AI upstream is unavailable.')
  }
}
