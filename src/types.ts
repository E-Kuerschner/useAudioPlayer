import React from "react"
import { HowlOptions, Howl } from "howler"
import { AudioPlayerState } from "./audioPlayerState"

export interface AudioOptions {
    // src and format intentionally do not mirror HowlOptions
    src: string
    format?: string
    autoplay?: HowlOptions["autoplay"]
    html5?: HowlOptions["html5"]
    xhr?: HowlOptions["xhr"]
}

export interface AudioPlayerContext extends AudioPlayerState {
    player: Howl | null
    load: (args: AudioOptions) => void
}

export interface AudioPlayerPositionContext {
    position: number
    setPosition: React.Dispatch<number>
}
