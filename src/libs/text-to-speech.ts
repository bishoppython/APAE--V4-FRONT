import { useMemo } from 'react'
import { useSpeech } from 'react-text-to-speech'
import type { TTSOptions, UseTTSReturn, TTSStatus } from '@/types/speech'

interface UseTTSProps {
    text: string
    options?: TTSOptions
}

export function useTTS({ text, options = {} }: UseTTSProps): UseTTSReturn {
    const {
        lang = 'pt-BR',
        rate = 1.1,
        pitch = 1.2,
        volume = 1,
    } = options

    const { speechStatus, Text: HighlightedText, start, pause, stop } = useSpeech({
        text,
        lang,
        rate,
        pitch,
        volume,
        highlightText: true,
    })


    const status = useMemo<TTSStatus>(() => {
        const map: Record<string, TTSStatus> = {
            started: 'playing',
            paused: 'paused',
            stopped: 'idle',
        }
        return map[speechStatus] ?? 'idle'
    }, [speechStatus])

    return {
        status,
        HighlightedText,
        play: start,
        pause,
        stop,
    }
}