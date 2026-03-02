export type OcrMode = 'SELF' | 'OTHER'

export interface OcrFlowUiState {
  mode: OcrMode | null
  capturedImageUrl: string | null
}

export interface OcrJobResult {
  task_id: string
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
  task_id: string
  status: OcrTaskStatus
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

export interface OcrPollBffResponse {
  task_id: string
  status: OcrTaskStatus
  mode: OcrMode
  image_url: string
  result: OcrTaskAiResult | null
  error: string | null
}
