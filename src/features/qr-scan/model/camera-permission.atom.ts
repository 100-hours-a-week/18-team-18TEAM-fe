import { atom } from 'jotai'

export type CameraPermissionState = 'unknown' | 'granted' | 'denied' | 'prompt'

export const cameraPermissionAtom = atom<CameraPermissionState>('unknown')
