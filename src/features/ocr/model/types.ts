export type OcrMode = 'SELF' | 'OTHER'

export interface OcrFlowUiState {
  mode: OcrMode | null
  capturedImageUrl: string | null
}

export interface OcrJobResult {
  jobId: string
  mode: OcrMode
  capturedImageUrl: string | null
  name: string
  email: string
  company: string
  phone_number: string
  lined_number: string
  position: string
  department: string
  is_progress: boolean
  start_date: string
  end_date: string
}

export interface OcrStartRequest {
  mode: OcrMode
  capturedImageUrl: string
}

export interface OcrStartResponse {
  jobId: string
}

export interface OcrSubmitRequest {
  name: string
  email: string
  company: string
  phone_number: string
  lined_number: string
  position: string
  department: string
  is_progress: boolean
  start_date: string
  end_date: string
}
