import type {
  OcrJobResult,
  OcrStartRequest,
  OcrStartResponse,
  OcrSubmitRequest,
} from '../model'
import {
  createMockOcrJob,
  getMockOcrJob,
  updateMockOcrJob,
} from './ocr.mock-store'

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function startOcrJob(
  request: OcrStartRequest
): Promise<OcrStartResponse> {
  await wait(250)
  return createMockOcrJob(request.mode, request.capturedImageUrl)
}

export async function getOcrJobResult(jobId: string): Promise<OcrJobResult> {
  await wait(250)

  const result = getMockOcrJob(jobId)
  if (!result) {
    throw new Error('OCR job result not found.')
  }

  return result
}

export async function submitOcrResult(
  jobId: string,
  data: OcrSubmitRequest
): Promise<void> {
  await wait(300)

  const updated = updateMockOcrJob(jobId, data)
  if (!updated) {
    throw new Error('OCR job result not found.')
  }
}
