import { atom } from 'jotai'
import type { OcrFlowUiState } from './types'

const initialOcrFlowState: OcrFlowUiState = {
  mode: null,
  capturedImageUrl: null,
}

export const ocrFlowAtom = atom<OcrFlowUiState>(initialOcrFlowState)
