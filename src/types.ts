export interface AudioSrcProps {
    src: string
    format?: string
    autoplay?: boolean
}

export interface AudioPlayer {
    player: Howl | null
    load: (args: AudioSrcProps) => void
    error: Error | null
    loading: boolean
    playing: boolean
    stopped: boolean
    ready: boolean
    duration: number
    ended: boolean
}
