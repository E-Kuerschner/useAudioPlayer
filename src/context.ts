import React from "react"
import { AudioPlayerContext, AudioPlayerPositionContext } from "./types"

export const playerContext = React.createContext<AudioPlayerContext | null>(
    null
)

export const positionContext = React.createContext<AudioPlayerPositionContext>({
    position: 0,
    setPosition: () => {}
})
