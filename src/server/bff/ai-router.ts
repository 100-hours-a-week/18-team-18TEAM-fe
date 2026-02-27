import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { forwardToAi } from '@/server/bff/ai-client'
import { toProxyHeaders, type ForwardRequestBody } from '@/server/bff/spring-client'

type OcrTaskStatus = 'pending' | 'running' | 'completed' | 'failed'
type OcrMode = 'SELF' | 'OTHER'
type JsonRecord = Record<string, unknown>

interface OcrTaskAiResult {
  is_business_card: boolean
  name?: string | null
  email?: string | null
  company?: string | null
  job_title?: string | null
  department?: string | null
  company_phone?: string | null
  mobile_phone?: string | null
}

interface OcrPollBffResponse {
  task_id: string
  task_type: string | null
  status: OcrTaskStatus
  progress: unknown | null
  created_at: string | null
  started_at: string | null
  completed_at: string | null
  mode: OcrMode
  result: OcrTaskAiResult | null
  error: string | null
}

interface AiProxyRequestOptions {
  request: NextRequest
  apiPath: string
  search: string
  method: string
  body?: ForwardRequestBody
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

function rewriteAiApiPathForKnownRoutes(apiPath: string, method: string): string {
  if (method === 'POST' && apiPath === '/ocr/start') {
    return '/ocr/analyze'
  }

  return apiPath
}

function extractOcrTaskId(apiPath: string): string | null {
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
  if (typeof value !== 'string') return null
  return value
}

function pickNullableUnknown(
  candidates: Array<JsonRecord | null>,
  keys: string[]
): unknown | null {
  const value = pickUnknown(candidates, keys)
  return value === undefined ? null : value
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

function toOcrMode(value: unknown): OcrMode {
  return typeof value === 'string' && value.toUpperCase() === 'SELF'
    ? 'SELF'
    : 'OTHER'
}

function toOcrTaskAiResult(payload: JsonRecord): OcrTaskAiResult | null {
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
    mobile_phone: pickNullableString(candidates, [
      'mobile_phone',
      'mobilePhone',
    ]),
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

async function handleAiOcrPoll(
  request: NextRequest,
  taskId: string
): Promise<NextResponse> {
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
  const taskIdFromStatus = pickNullableString(statusCandidates, [
    'task_id',
    'taskId',
  ])
  const taskType = pickNullableString(statusCandidates, [
    'task_type',
    'taskType',
  ])
  const status = toOcrTaskStatus(pickUnknown(statusCandidates, ['status']))
  const progress = pickNullableUnknown(statusCandidates, ['progress'])
  const createdAt = pickNullableString(statusCandidates, [
    'created_at',
    'createdAt',
  ])
  const startedAt = pickNullableString(statusCandidates, [
    'started_at',
    'startedAt',
  ])
  const completedAt = pickNullableString(statusCandidates, [
    'completed_at',
    'completedAt',
  ])
  const mode = toOcrMode(pickUnknown(statusCandidates, ['mode']))
  const error = pickNullableString(statusCandidates, ['error', 'message'])

  if (status !== 'completed') {
    const pollResponse: OcrPollBffResponse = {
      task_id: taskIdFromStatus || taskId,
      task_type: taskType,
      status,
      progress,
      created_at: createdAt,
      started_at: startedAt,
      completed_at: completedAt,
      mode,
      result: null,
      error,
    }
    return NextResponse.json(pollResponse, { status: 200 })
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

  const pollResponse: OcrPollBffResponse = {
    task_id: taskIdFromStatus || taskId,
    task_type: taskType,
    status: 'completed',
    progress,
    created_at: createdAt,
    started_at: startedAt,
    completed_at: completedAt,
    mode,
    result: toOcrTaskAiResult(resultPayload),
    error,
  }

  return NextResponse.json(pollResponse, { status: 200 })
}

export async function proxyAiRequest({
  request,
  apiPath,
  search,
  method,
  body,
}: AiProxyRequestOptions): Promise<NextResponse> {
  const aiApiPath = toAiApiPath(apiPath)
  const ocrTaskId = method === 'GET' ? extractOcrTaskId(aiApiPath) : null

  try {
    if (ocrTaskId && aiApiPath.startsWith('/ocr/')) {
      return await handleAiOcrPoll(request, ocrTaskId)
    }

    const rewrittenApiPath = rewriteAiApiPathForKnownRoutes(aiApiPath, method)
    const upstream = await forwardToAi({
      apiPath: rewrittenApiPath,
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
