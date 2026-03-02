import { getServerEnv } from '@/server/config/env'
import { redisGet, redisSetEx } from '@/server/redis/client'

export type OcrMode = 'SELF' | 'OTHER'
export type OcrTaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface OcrTaskAiResult {
  is_business_card: boolean
  name?: string | null
  email?: string | null
  company?: string | null
  job_title?: string | null
  department?: string | null
  company_phone?: string | null
  mobile_phone?: string | null
}

export interface OcrJobRecord {
  task_id: string
  mode: OcrMode
  image_url: string
  status: OcrTaskStatus
  userId: number | string | null
  result: OcrTaskAiResult | null
  error: string | null
  created_at: string
  updated_at: string
}

const DEFAULT_OCR_JOB_TTL_SECONDS = 24 * 60 * 60

function buildOcrJobKey(taskId: string): string {
  const { redisNamespace } = getServerEnv()
  return `${redisNamespace}:ocr:job:${taskId}`
}

function readOcrJobTtlSeconds(): number {
  const raw = process.env.OCR_JOB_TTL_SECONDS
  if (!raw) return DEFAULT_OCR_JOB_TTL_SECONDS
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_OCR_JOB_TTL_SECONDS
  }
  return parsed
}

function isOcrTaskStatus(value: unknown): value is OcrTaskStatus {
  return (
    value === 'pending' ||
    value === 'running' ||
    value === 'completed' ||
    value === 'failed'
  )
}

function isOcrMode(value: unknown): value is OcrMode {
  return value === 'SELF' || value === 'OTHER'
}

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === 'string' || value === null
}

function isOcrTaskAiResult(value: unknown): value is OcrTaskAiResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>

  if (typeof record.is_business_card !== 'boolean') return false

  const optionalStringKeys = [
    'name',
    'email',
    'company',
    'job_title',
    'department',
    'company_phone',
    'mobile_phone',
  ] as const

  return optionalStringKeys.every((key) => {
    const field = record[key]
    return field === undefined || isStringOrNull(field)
  })
}

function isOcrJobRecord(value: unknown): value is OcrJobRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>

  return (
    typeof record.task_id === 'string' &&
    isOcrMode(record.mode) &&
    typeof record.image_url === 'string' &&
    isOcrTaskStatus(record.status) &&
    (typeof record.userId === 'number' ||
      typeof record.userId === 'string' ||
      record.userId === null) &&
    (record.result === null || isOcrTaskAiResult(record.result)) &&
    isStringOrNull(record.error) &&
    typeof record.created_at === 'string' &&
    typeof record.updated_at === 'string'
  )
}

async function saveJob(record: OcrJobRecord): Promise<void> {
  await redisSetEx(
    buildOcrJobKey(record.task_id),
    readOcrJobTtlSeconds(),
    JSON.stringify(record)
  )
}

export async function createOcrJob(record: OcrJobRecord): Promise<void> {
  await saveJob(record)
}

export async function getOcrJob(taskId: string): Promise<OcrJobRecord | null> {
  const raw = await redisGet(buildOcrJobKey(taskId))
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!isOcrJobRecord(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export async function updateOcrJob(
  taskId: string,
  patch: Partial<Pick<OcrJobRecord, 'status' | 'result' | 'error'>>
): Promise<OcrJobRecord | null> {
  const current = await getOcrJob(taskId)
  if (!current) return null

  const updated: OcrJobRecord = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString(),
  }
  await saveJob(updated)
  return updated
}
