import type { OcrJobResult, OcrMode, OcrSubmitRequest } from '../model'

const STORAGE_PREFIX = 'ocr:job:'

const memoryStore = new Map<string, string>()

function getStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function getStorageKey(jobId: string) {
  return `${STORAGE_PREFIX}${jobId}`
}

function writeJobToStore(job: OcrJobResult) {
  const key = getStorageKey(job.jobId)
  const value = JSON.stringify(job)
  const storage = getStorage()

  if (storage) {
    storage.setItem(key, value)
    return
  }

  memoryStore.set(key, value)
}

function readJobFromStore(jobId: string): OcrJobResult | null {
  const key = getStorageKey(jobId)
  const storage = getStorage()

  const rawValue = storage ? storage.getItem(key) : memoryStore.get(key) || null
  if (!rawValue) return null

  try {
    return JSON.parse(rawValue) as OcrJobResult
  } catch {
    return null
  }
}

function createDefaultResult(
  jobId: string,
  mode: OcrMode,
  capturedImageUrl: string
): OcrJobResult {
  return {
    jobId,
    mode,
    capturedImageUrl,
    name: mode === 'SELF' ? '김윤영' : '홍길동',
    email: mode === 'SELF' ? 'kim@example.com' : 'hong@example.com',
    company: mode === 'SELF' ? 'CARO' : 'BizKit',
    phone_number: '010-1234-5678',
    lined_number: '02-123-4567',
    position: mode === 'SELF' ? '프론트엔드 개발자' : '매니저',
    department: mode === 'SELF' ? '개발팀' : '사업개발',
    is_progress: mode === 'SELF',
    start_date: mode === 'SELF' ? '2024-01-01' : '',
    end_date: '',
  }
}

function generateJobId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createMockOcrJob(mode: OcrMode, capturedImageUrl: string) {
  const jobId = generateJobId()
  const result = createDefaultResult(jobId, mode, capturedImageUrl)
  writeJobToStore(result)
  return { jobId, result }
}

export function getMockOcrJob(jobId: string): OcrJobResult | null {
  return readJobFromStore(jobId)
}

export function updateMockOcrJob(jobId: string, data: OcrSubmitRequest) {
  const currentJob = readJobFromStore(jobId)
  if (!currentJob) return null

  const updated: OcrJobResult = {
    ...currentJob,
    ...data,
  }

  writeJobToStore(updated)
  return updated
}
