import { AudioPlayerState } from "./audioPlayerState"

export interface AudioSrcProps {
    src: string
    format?: string
    autoplay?: boolean
}

export interface AudioPlayerContext extends AudioPlayerState {
    player: Howl | null
    load: (args: AudioSrcProps) => void
}
