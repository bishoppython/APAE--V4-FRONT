import type { ComponentType } from 'react'
export type TTSStatus = 'idle' | 'playing' | 'paused'

export interface TTSOptions {
    lang?: string
    rate?: number
    pitch?: number
    volume?: number
}


export interface UseTTSReturn {
    status: TTSStatus
    HighlightedText: ComponentType
    play: () => void
    pause: () => void
    stop: () => void
}