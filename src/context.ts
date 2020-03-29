import React from "react"
import { AudioPlayer } from "./types"

export const AudioPlayerContext = React.createContext<AudioPlayer | null>(null)
